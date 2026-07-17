export const TECHNOLOGY_CATALOG = {
  frontend: {
    name: "Frontend Engineer",
    categories: {
      Languages: ["JavaScript", "TypeScript", "HTML", "CSS"],
      Frameworks: ["React", "Next.js", "Vue", "Angular", "Svelte", "Remix"],
      Libraries: ["Redux", "Zustand", "Tailwind CSS", "Bootstrap", "Radix UI", "Chakra UI"],
      Testing: ["Jest", "Cypress", "Playwright", "Vitest", "Testing Library"],
      Tools: ["Git", "Vite", "Webpack", "npm", "Yarn", "pnpm", "ESLint"],
    },
  },
  backend: {
    name: "Backend Engineer",
    categories: {
      Languages: ["JavaScript", "TypeScript", "Python", "Go", "Java", "C#", "Ruby", "PHP"],
      Frameworks: ["Express", "NestJS", "FastAPI", "Django", "Spring Boot", "ASP.NET Core", "Laravel", "Koa"],
      Databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "DynamoDB", "Cassandra"],
      Testing: ["Jest", "Supertest", "PyTest", "JUnit", "Mocha"],
      DevOps: ["Docker", "Kubernetes", "GitHub Actions", "AWS", "PM2"],
      Tools: ["Git", "Postman", "Prisma", "Mongoose", "Swagger", "TypeORM"],
    },
  },
  fullstack: {
    name: "Full Stack Engineer",
    categories: {
      Languages: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"],
      Frameworks: ["Next.js", "Remix", "Express", "NestJS", "FastAPI", "Django"],
      Databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite"],
      Testing: ["Jest", "Cypress", "Playwright", "Vitest"],
      Cloud: ["AWS", "Vercel", "Netlify", "Heroku", "Supabase", "Firebase"],
      Tools: ["Git", "Docker", "Tailwind CSS", "Prisma", "Mongoose", "npm"],
    },
  },
  ai: {
    name: "AI Engineer",
    categories: {
      Languages: ["Python", "C++", "Julia", "R"],
      Frameworks: ["PyTorch", "TensorFlow", "Keras", "JAX"],
      Libraries: ["Hugging Face Transformers", "LangChain", "LlamaIndex", "Scikit-Learn", "Pandas", "NumPy"],
      Databases: ["Pinecone", "Milvus", "ChromaDB", "Weaviate", "Qdrant", "PostgreSQL (pgvector)"],
      Cloud: ["AWS", "GCP", "Hugging Face Spaces", "Replicate", "RunPod"],
      Tools: ["Jupyter Notebooks", "Git", "Docker", "Weights & Biases", "TensorBoard"],
    },
  },
  data: {
    name: "Data Engineer",
    categories: {
      Languages: ["Python", "SQL", "Scala", "Java"],
      Frameworks: ["Apache Spark", "Apache Flink", "Hadoop", "dbt", "Pandas"],
      Databases: ["PostgreSQL", "Snowflake", "BigQuery", "Redshift", "Cassandra", "MongoDB", "ClickHouse"],
      DevOps: ["Apache Airflow", "Prefect", "Docker", "Kubernetes"],
      Tools: ["Git", "Kafka", "Tableau", "PowerBI", "Databricks", "Athena"],
    },
  },
  devops: {
    name: "DevOps Engineer",
    categories: {
      Languages: ["Bash", "Python", "Go", "Ruby"],
      Cloud: ["AWS", "Azure", "GCP", "Cloudflare"],
      Tools: ["Git", "Docker", "Kubernetes", "Terraform", "Ansible", "Helm"],
      CI_CD: ["GitHub Actions", "GitLab CI", "Jenkins", "ArgoCD", "CircleCI"],
      Monitoring: ["Prometheus", "Grafana", "ELK Stack", "Datadog", "Jaeger"],
    },
  },
  cloud: {
    name: "Cloud Engineer",
    categories: {
      Languages: ["Python", "Bash", "Go", "PowerShell"],
      Providers: ["AWS", "Azure", "GCP", "Cloudflare", "DigitalOcean"],
      DevOps: ["Terraform", "Docker", "Kubernetes", "Serverless Framework", "Ansible"],
      Services: ["S3", "EC2", "Lambda", "IAM", "VPC", "RDS", "Cognito", "CloudWatch"],
      Tools: ["Git", "AWS CLI", "Terragrunt", "LocalStack"],
    },
  },
  cybersecurity: {
    name: "Cyber Security",
    categories: {
      Languages: ["Python", "Bash", "PowerShell", "C", "C++", "SQL"],
      Tools: ["Wireshark", "Nmap", "Metasploit", "Burp Suite", "Kali Linux", "John the Ripper", "Hydra"],
      Concepts: ["Network Security", "Penetration Testing", "Cryptography", "IAM", "OWASP Top 10", "Incident Response"],
      Monitoring: ["Splunk", "Snort", "Suricata", "OSSEC", "Wireshark"],
    },
  },
  mobile: {
    name: "Mobile Developer",
    categories: {
      Languages: ["Swift", "Kotlin", "Java", "Dart", "TypeScript", "JavaScript"],
      Frameworks: ["iOS SDK", "Android SDK", "React Native", "Flutter", "Capacitor"],
      Databases: ["SQLite", "Realm", "Firebase Firestore", "Room", "CoreData"],
      Testing: ["XCTest", "Espresso", "Detox", "Jest"],
      Tools: ["Git", "Xcode", "Android Studio", "Fastlane", "Cocoapods", "Gradle"],
    },
  },
  productmanager: {
    name: "Product Manager",
    categories: {
      Management: ["Jira", "Confluence", "Linear", "Trello", "Asana", "Notion"],
      Design: ["Figma", "Miro", "Whimsical", "Balsamiq"],
      Analytics: ["Google Analytics", "Mixpanel", "Amplitude", "Hotjar"],
      Concepts: ["Agile/Scrum", "Product Roadmap", "User Stories", "A/B Testing", "KPIs", "User Persona"],
    },
  },
  uiux: {
    name: "UI/UX Designer",
    categories: {
      Tools: ["Figma", "Adobe XD", "Sketch", "Framer", "InVision", "Axure"],
      Collaboration: ["Miro", "Whimsical", "Zeplin", "Notion"],
      Concepts: ["Wireframing", "Prototyping", "User Research", "Information Architecture", "Usability Testing", "Design Systems"],
      Libraries: ["Tailwind CSS", "Bootstrap", "Framer Motion"],
    },
  },
};

export const ALL_TECHNOLOGIES = Array.from(
  new Set(
    Object.values(TECHNOLOGY_CATALOG).flatMap((role) =>
      Object.values(role.categories).flat(),
    ),
  ),
).sort();
