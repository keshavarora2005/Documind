import os
import fitz  # pymupdf
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# ── System prompts per user type ──────────────────────────────────────────────

SYSTEM_PROMPTS = {
    "student": """You are an expert student tutor and study assistant.
When answering questions:
- Explain concepts simply and clearly
- Use examples and analogies
- If asked, generate practice questions
- Break down complex topics step by step
- Encourage the student
Always answer based on the uploaded study material.""",

    "business": """You are an expert business document analyst.
When answering questions:
- Be precise and cite article/clause references
- Highlight any risks or important obligations
- Calculate financials accurately if asked
- Flag deadlines, penalties, and key dates
- Keep answers concise and actionable
Always answer based on the uploaded business documents.""",

    "lawyer": """You are an expert legal document assistant.
When answering questions:
- Reference specific clauses and sections precisely
- Identify potential legal risks and obligations
- Highlight ambiguous language
- Note jurisdiction-specific considerations
Always answer based on the uploaded legal documents.""",

    "doctor": """You are an expert medical document assistant.
When answering questions:
- Summarize medical information clearly
- Highlight critical values, dosages, or findings
- Flag any urgent or abnormal information
Always answer based on the uploaded medical documents.""",

    "researcher": """You are an expert research assistant.
When answering questions:
- Summarize key findings and methodologies
- Extract data, statistics, and conclusions
- Identify research gaps or limitations mentioned
Always answer based on the uploaded research documents.""",

    "hr": """You are an expert HR document assistant.
When answering questions:
- Clarify policies and procedures clearly
- Highlight employee rights and obligations
- Extract key dates, deadlines, and requirements
Always answer based on the uploaded HR documents.""",

    "finance": """You are an expert financial document assistant.
When answering questions:
- Extract key financial figures accurately
- Identify trends, risks, or anomalies
- Calculate and verify numbers when asked
Always answer based on the uploaded financial documents.""",

    "other": """You are an expert document assistant.
Answer questions clearly and accurately based on the uploaded documents.""",
}

# ── In-memory vector store per session ───────────────────────────────────────
_stores = {}  # session_id → FAISS vectorstore

def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return "\n".join(page.get_text() for page in doc)

def build_vectorstore(session_id: str, texts: list[str]):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)
    chunks = []
    for text in texts:
        chunks.extend(splitter.split_text(text))
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    vs = FAISS.from_texts(chunks, embedding=embeddings)
    _stores[session_id] = vs

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

def get_answer(session_id: str, question: str, user_type: str) -> str:
    if session_id not in _stores:
        return "Please upload your documents first."

    vs = _stores[session_id]
    retriever = vs.as_retriever(search_kwargs={"k": 4})
    system = SYSTEM_PROMPTS.get(user_type, SYSTEM_PROMPTS["other"])

    prompt = ChatPromptTemplate.from_template(f"""
{system}

Context from documents:
{{context}}

Question: {{question}}

Answer:
""")
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.3
    )
    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain.invoke(question)

def get_summary(session_id: str, user_type: str) -> str:
    if session_id not in _stores:
        return "Please upload your documents first."

    summaries = {
        "student": "Summarize this study material. Include: main topics, key concepts, important formulas or facts, and suggest 3 practice questions.",
        "business": "Summarize this business document. Include: overall summary, key clauses, important dates & numbers, risks, and action items.",
        "lawyer": "Summarize this legal document. Include: parties involved, key obligations, important clauses, risks, and deadlines.",
        "doctor": "Summarize this medical document. Include: key findings, critical values, recommendations, and urgent items.",
        "researcher": "Summarize this research document. Include: objectives, methodology, key findings, conclusions, and limitations.",
        "hr": "Summarize this HR document. Include: key policies, employee obligations, important dates, and action items.",
        "finance": "Summarize this financial document. Include: key figures, financial health indicators, risks, and recommendations.",
        "other": "Provide a comprehensive summary of this document with key points and important information.",
    }
    return get_answer(session_id, summaries.get(user_type, summaries["other"]), user_type)

def clear_session(session_id: str):
    _stores.pop(session_id, None)