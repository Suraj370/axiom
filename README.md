# Axiom ⚡️

**The OS for your Backend Logic.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)

Axiom is a powerful, visual workflow automation builder that allows you to chain together AI models, databases, and APIs without writing boilerplate code. Whether you are building complex RAG pipelines, simple cron jobs, or autonomous AI agents, Axiom provides the infrastructure to build, deploy, and monitor them visually.

[**View Live Demo**](https://axiom-sage.vercel.app)

![Axiom Workflow Canvas](https://axiom-sage.vercel.app/_next/image?url=%2Fworkflow-canvas.png&w=3840&q=75)

## ✨ Features

- **🎨 Visual Infinite Canvas**: Drag, drop, and connect nodes to build complex logic flows in seconds.
- **🤖 AI-First Integrations**: Native support for **Gemini**, OpenAI, and other LLMs to build intelligent agents.
- **🔐 Secure Credential Vault**: Bank-grade security for your API keys. Never hardcode secrets again; manage them centrally.
- **📊 Real-time Observability**:
  - Track every execution with precision timing.
  - **Sequential Logging**: Inspect logs with sequential IDs and timestamps for easy debugging.
  - Deep-dive into JSON payloads for total transparency.
- **🔌 Diverse Nodes**: Connect Discord, Databases, Custom APIs, and more.
- **⚡️ Instant Deployment**: Push your workflows to production immediately without managing infrastructure.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Linting**: [Biome](https://biomejs.dev/)
- **Monitoring**: [Sentry](https://sentry.io/)

## 🚀 Getting Started

Follow these steps to run Axiom locally on your machine.

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A PostgreSQL database (or a local instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Suraj370/axiom.git](https://github.com/Suraj370/axiom.git)
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up Environment Variables Create a .env file in the root directory and add your database connection string and other keys:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/axiom_db"
   # Add other keys as required (e.g., Clerk/Auth, API Keys)
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
4. Initialize the Database Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```
5. Run the Development Server

### 📂 Project Structure
 
   ```bash
  axiom/
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable UI components
├── prisma/            
│   └── schema.prisma   # Database schema
├── public/             # Static assets
├── lib/                # Utility functions and shared logic
├── next.config.ts      # Next.js configuration
├── biome.json          # Linter configuration
└── ...
   ```
### 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

