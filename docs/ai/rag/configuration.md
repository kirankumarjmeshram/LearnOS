# Configuration

| Variable | Purpose | Local default |
| --- | --- | --- |
| `QDRANT_URL` | Qdrant REST endpoint | `http://localhost:6333` |
| `QDRANT_API_KEY` | Optional Qdrant Cloud credential | empty |
| `QDRANT_COLLECTION` | Collection for LearnOS chunks | `learnos_document_chunks` |
| `GEMINI_EMBEDDING_MODEL` | Google embedding model | `gemini-embedding-001` |
| `RAG_EMBEDDING_DIMENSIONS` | Required vector length | `768` |
| `RAG_TOP_K` | Maximum chunks sent to generation | `5` |
| `RAG_CHUNK_SIZE` | Target chunk size in characters | `1200` |
| `RAG_CHUNK_OVERLAP` | Context retained between chunks | `200` |

The installed `@google/genai` SDK exposes `models.embedContent` and supports `outputDimensionality`. LearnOS explicitly requests 768 dimensions from `gemini-embedding-001`, validates the returned length, then normalizes the reduced-dimension vectors before they reach Qdrant. Changing the embedding model or dimension requires reprocessing documents into a matching collection.

`GEMINI_API_KEY` is reused from the existing Gemini configuration. Never commit it or a Qdrant API key.
