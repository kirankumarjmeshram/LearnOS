# LearnOS RAG Interview Guide

## Explain the RAG implementation in LearnOS

LearnOS uses RAG so its AI tutor can answer from a learner's own study material rather than relying only on the model's general knowledge. When a learner processes a PDF, DOCX, text, or Markdown resource, the server verifies ownership, extracts readable text, normalizes it, and splits it into overlapping chunks. Each chunk is embedded with the existing Google GenAI provider and stored in Qdrant with the authenticated user ID, resource ID, lesson ID when available, and chunk metadata.

When the learner asks the tutor a question, LearnOS converts the question to a query embedding and searches Qdrant with a mandatory user filter. Optional resource and lesson filters are also checked against MongoDB ownership before the search. The top matching chunks become a compact, source-labelled context for Gemini. Gemini is instructed to prioritize that evidence and acknowledge gaps. The API returns the answer plus source metadata, which the tutor UI renders. Keeping ingestion, embeddings, vector storage, retrieval, and generation separate makes the system easier to test and lets us replace an individual provider later.

## Fundamentals

| Question | Answer |
| --- | --- |
| What is RAG? | A pattern that retrieves relevant external knowledge before generating an answer. |
| What is an embedding? | A numeric vector that represents semantic meaning, allowing similarity search. |
| What is Qdrant? | The vector database that stores LearnOS document chunks and runs similarity search. |
| What is chunking? | Breaking a document into smaller excerpts that can be retrieved and fit in model context. |
| What is Top-K? | The configurable maximum number of closest chunks returned for a question. |
| Why RAG instead of a direct prompt? | It grounds the response in current learner material and returns traceable sources. |

## LearnOS implementation

| Question | Answer |
| --- | --- |
| What happens after a PDF upload? | It is stored as a resource; choosing Process for AI synchronously extracts, chunks, embeds, and indexes it. |
| Why Qdrant? | It keeps vector operations behind a small repository while MongoDB remains the system of record for ownership. |
| How is cross-user retrieval prevented? | Clerk derives `userId`; the server verifies IDs in MongoDB and every Qdrant search requires the same `userId` payload filter. |
| How do sources reach the UI? | Retrieval metadata is mapped to `sources` and added to the existing lesson-chat response. |
| What happens with no matches? | The generation layer returns a clear no-evidence answer and an empty source list. |

## Architecture and future work

- Ingestion, retrieval, and generation are separate because file handling, vector operations, and prompt construction evolve independently.
- LearnOS does not send an entire PDF to Gemini: that would increase latency/cost and make evidence selection weaker.
- A large-document production design would add durable asynchronous ingestion, but Phase 1 intentionally remains synchronous.
- Hybrid search, reranking, OCR, caching, knowledge graphs, agents, and MCP are not implemented. They are future improvements after retrieval quality is measured.
- Changing embedding providers requires reprocessing so every stored vector shares the same embedding space and dimension.
