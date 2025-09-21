# microservice.py
import os
import io
from typing import List

import torch
import numpy as np
import faiss
import PyPDF2
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModel

# --------------------------
# CPU-safe setup
# --------------------------
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"  # Ignore OpenMP errors
torch.set_num_threads(1)                      # PyTorch single-thread
faiss.omp_set_num_threads(1)                  # FAISS single-thread

# --------------------------
# FastAPI app
# --------------------------
app = FastAPI(title="InLegalBERT + FAISS Microservice")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:5000"] for Node backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Load InLegalBERT
# --------------------------
MODEL_NAME = "law-ai/InLegalBERT"
API_KEY = os.getenv("HUGGINGFACE_API_KEY", "YOUR_HUGGINGFACE_API_KEY_HERE")

print("Loading InLegalBERT model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=API_KEY)
model = AutoModel.from_pretrained(MODEL_NAME, token=API_KEY)
print("✅ InLegalBERT model loaded successfully!")

def get_embedding(text: str) -> np.ndarray:
    """Convert text to embedding using InLegalBERT"""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1)  # (1, hidden_size)
    return embeddings.numpy().astype("float32")  # FAISS requires float32

# --------------------------
# FAISS setup
# --------------------------
embedding_dim = 768
faiss_index = faiss.IndexFlatL2(embedding_dim)
file_mapping = {}  # maps index position → filename
current_index = 0

# --------------------------
# Legal summary
# --------------------------
def create_legal_summary(text: str):
    key_terms = ["agreement", "contract", "employee", "company", "confidentiality",
                 "terms", "conditions", "employment", "salary", "benefits", "termination"]
    found_terms = [term for term in key_terms if term.lower() in text.lower()]
    doc_type = "employment agreement" if "employee" in found_terms else "legal contract"

    summary = (
        f"Legal document analysis: {len(text)} chars, {len(text.split())} words. "
        f"Document type: {doc_type}. "
        f"Key legal terms: {', '.join(found_terms[:5])}."
    )
    return summary

# --------------------------
# Request models
# --------------------------
class TextRequest(BaseModel):
    text: str
    filename: str

class QueryRequest(BaseModel):
    query: str
    k: int = 3

# --------------------------
# Endpoints
# --------------------------

@app.get("/")
async def root():
    return {"message": "Hello, Backend is running 🚀"}

@app.post("/process-text")
async def process_text(req: TextRequest):
    global current_index
    
    # Create summary
    summary = create_legal_summary(req.text)
    
    # Add to FAISS
    embedding = get_embedding(req.text)
    faiss_index.add(embedding)
    file_mapping[current_index] = req.filename
    current_index += 1
    
    return {"summary": summary, "indexed": True}

@app.post("/api/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    global current_index
    results = []

    for file in files:
        try:
            contents = await file.read()
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""

            # Summary
            summary = create_legal_summary(text)

            # Embedding & FAISS
            embedding = get_embedding(text)
            faiss_index.add(embedding)
            file_mapping[current_index] = file.filename
            current_index += 1

            results.append({"filename": file.filename, "summary": summary})

        except Exception as e:
            results.append({"filename": file.filename, "error": str(e)})

    return {"summaries": results}
@app.post("/api/query")
async def query_embeddings(req: QueryRequest):
    query = req.query
    k = req.k

    if faiss_index.ntotal == 0:
        return {"error": "No documents indexed yet."}

    # Get embedding for query
    embedding = get_embedding(query)
    embedding = embedding.astype("float32").reshape(1, -1)  # FAISS expects float32

    # Search FAISS
    D, I = faiss_index.search(embedding, k)

    results = []
    for dist, idx in zip(D[0], I[0]):
        if idx == -1:
            continue  # skip invalid index
        results.append({
            "filename": file_mapping[idx],
            "distance": float(dist)
        })

    return {"results": results}

# --------------------------
# Run server
# --------------------------
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting InLegalBERT + FAISS Microservice on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)