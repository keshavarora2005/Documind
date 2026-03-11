from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class SignupView(APIView):
    def post(self, request):
        name     = request.data.get("name", "").strip()
        email    = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not all([name, email, password]):
            return Response({"error": "All fields are required"}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        user = User.objects.create_user(
            username=email, email=email,
            password=password, first_name=name
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": {"name": user.first_name, "email": user.email}
        })


class LoginView(APIView):
    def post(self, request):
        email    = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not all([email, password]):
            return Response({"error": "Email and password are required"}, status=400)

        user = authenticate(username=email, password=password)
        if not user:
            return Response({"error": "Invalid email or password"}, status=401)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": {"name": user.first_name, "email": user.email}
        })
    

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserSession, Document, ChatMessage
from .rag import build_vectorstore, get_answer, get_summary, clear_session


class StartSessionView(APIView):
    def post(self, request):
        user_type = request.data.get("user_type")
        if not user_type:
            return Response({"error": "user_type is required"}, status=400)
        session = UserSession.objects.create(user_type=user_type)
        return Response({"session_id": str(session.id), "user_type": user_type})


class UploadDocumentsView(APIView):
    def post(self, request):
        session_id = request.data.get("session_id")
        files      = request.FILES.getlist("files")

        if not session_id or not files:
            return Response({"error": "session_id and files are required"}, status=400)

        try:
            session = UserSession.objects.get(id=session_id)
        except UserSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=404)

        texts, doc_names = [], []
        for f in files:
            try:
                import fitz
                doc  = fitz.open(stream=f.read(), filetype="pdf")
                text = "\n".join(page.get_text() for page in doc)
                texts.append(text)
                Document.objects.create(session=session, filename=f.name)
                doc_names.append(f.name)
            except Exception as e:
                return Response({"error": f"Failed to process {f.name}: {str(e)}"}, status=500)

        try:
            build_vectorstore(str(session_id), texts)
        except Exception as e:
            return Response({"error": f"Failed to build index: {str(e)}"}, status=500)

        return Response({"message": f"{len(files)} document(s) processed", "documents": doc_names})


class ChatView(APIView):
    def post(self, request):
        session_id = request.data.get("session_id")
        question   = request.data.get("question")

        if not session_id or not question:
            return Response({"error": "session_id and question are required"}, status=400)

        try:
            session = UserSession.objects.get(id=session_id)
        except UserSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=404)

        ChatMessage.objects.create(session=session, role="user", content=question)

        try:
            answer = get_answer(str(session_id), question, session.user_type)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

        ChatMessage.objects.create(session=session, role="assistant", content=answer)
        return Response({"answer": answer})


class SummaryView(APIView):
    def post(self, request):
        session_id = request.data.get("session_id")
        if not session_id:
            return Response({"error": "session_id is required"}, status=400)

        try:
            session = UserSession.objects.get(id=session_id)
        except UserSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=404)

        try:
            summary = get_summary(str(session_id), session.user_type)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

        return Response({"summary": summary})


class ChatHistoryView(APIView):
    def get(self, request):
        session_id = request.query_params.get("session_id")
        if not session_id:
            return Response({"error": "session_id is required"}, status=400)
        msgs = ChatMessage.objects.filter(session_id=session_id)
        return Response({"messages": [{"role": m.role, "content": m.content} for m in msgs]})


class ClearSessionView(APIView):
    def post(self, request):
        session_id = request.data.get("session_id")
        if not session_id:
            return Response({"error": "session_id is required"}, status=400)
        clear_session(session_id)
        UserSession.objects.filter(id=session_id).delete()
        return Response({"message": "Session cleared"})