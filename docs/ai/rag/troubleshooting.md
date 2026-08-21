# Troubleshooting

| Symptom | Check |
| --- | --- |
| Qdrant cannot connect | Start local Qdrant, then confirm `QDRANT_URL=http://localhost:6333`. |
| Unsupported document | Phase 1 supports only PDF, DOCX, TXT, and Markdown. |
| Empty document error | The file has no extractable text; scanned PDFs need OCR, which is future work. |
| Embedding dimension mismatch | Keep `GEMINI_EMBEDDING_MODEL` and `RAG_EMBEDDING_DIMENSIONS` compatible, then reprocess resources. |
| No sources in tutor answer | Process a resource first and ask a question related to its contents. |
| Resource deletion fails | Qdrant must be reachable so LearnOS can remove the associated private vectors before deleting the resource record. |

The API returns safe errors only. Inspect server logs for operational diagnosis; do not expose API keys or stack traces to users.
