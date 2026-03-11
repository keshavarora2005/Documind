from django.urls import path
from .views import SignupView, LoginView
from .views import (
    StartSessionView, UploadDocumentsView,
    ChatView, SummaryView, ChatHistoryView, ClearSessionView
)

urlpatterns = [
    path("auth/signup/",       SignupView.as_view()),
    path("auth/login/",        LoginView.as_view()),
    path("session/start/",     StartSessionView.as_view()),
    path("session/clear/",     ClearSessionView.as_view()),
    path("documents/upload/",  UploadDocumentsView.as_view()),
    path("chat/",              ChatView.as_view()),
    path("chat/history/",      ChatHistoryView.as_view()),
    path("summary/",           SummaryView.as_view()),
]