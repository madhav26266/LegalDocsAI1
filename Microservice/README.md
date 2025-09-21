# LegalDocsAI Python Microservice

This microservice handles PDF text extraction and legal document analysis using AI.

## Setup
1. **create virtual  environment:**
   ```powershell
   python -m venv venv
   ```
   
2. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
4.  **Install additional dependencies:**
   ```powershell
  pip install fastapi uvicorn python-multipart PyPDF2 torch transformers huggingface-hub numpy faiss-cpu pydantic
   ```
5. **Run the microservice:**
   ```powershell
   python microservice.py
   ```

## API Endpoints

- `POST /process-text` - Process text from Node.js backend
- `POST /api/upload` - Direct PDF upload and processing
- `GET /docs` - API documentation (Swagger UI)

## Port
Runs on port 8000



