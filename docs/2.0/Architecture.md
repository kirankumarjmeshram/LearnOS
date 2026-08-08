# Architecture

### Application Layer

| Component       | Technology                   |
| --------------- | ---------------------------- |
| Frontend        | Next.js + React + TypeScript |
| Main Backend    | NestJS                       |
| AI Backend      | FastAPI                      |
| Database        | PostgreSQL                   |
| ORM             | Prisma                       |
| Cache           | Redis                        |
| Queue           | BullMQ                       |
| Vector DB       | Qdrant                       |
| Knowledge Graph | Neo4j (later)                |

---

### AI Layer

| Component       | Technology                              |
| --------------- | --------------------------------------- |
| AI SDK          | Vercel AI SDK                           |
| Agent Framework | LangGraph                               |
| LLM Providers   | OpenAI, Gemini, Anthropic, Groq, Ollama |
| Embeddings      | OpenAI/BGE                              |
| RAG             | Qdrant                                  |

---

### DevOps

| Component               | Technology         |
| ----------------------- | ------------------ |
| Containers              | Docker             |
| Container Orchestration | Kubernetes (later) |
| CI/CD                   | GitHub Actions     |
| Reverse Proxy           | Nginx or Traefik   |
| Infrastructure          | Terraform (later)  |

---

### Monitoring & Observability

| Component           | Technology                                                  |
| ------------------- | ----------------------------------------------------------- |
| Logs                | ELK Stack (Elasticsearch + Logstash + Kibana) or OpenSearch |
| Metrics             | Prometheus                                                  |
| Dashboards          | Grafana                                                     |
| Distributed Tracing | OpenTelemetry                                               |
| Error Tracking      | Sentry                                                      |
| Health Checks       | NestJS Terminus                                             |

---

### Security

| Component      | Technology                               |
| -------------- | ---------------------------------------- |
| Authentication | Clerk (or Better Auth later)             |
| Authorization  | RBAC + Permissions                       |
| Rate Limiting  | Redis                                    |
| Secrets        | Doppler or environment variables for MVP |
| Validation     | Zod + class-validator                    |
| API Docs       | Swagger                                  |

---

### Storage

| Component      | Technology                                    |
| -------------- | --------------------------------------------- |
| Object Storage | MinIO (development) → AWS S3 / Cloudflare R2 |
| CDN            | Cloudflare                                    |

---

### Communication

| Component          | Technology               |
| ------------------ | ------------------------ |
| Email              | Resend                   |
| Push Notifications | Firebase Cloud Messaging |
| Real-time          | Socket.IO/WebSockets     |

---

### Testing

| Component           | Technology  |
| ------------------- | ----------- |
| Unit Testing        | Vitest/Jest |
| Integration Testing | Jest        |
| E2E Testing         | Playwright  |
| API Testing         | Bruno or P  |
