🧪 PromptForge – Visual AI Prompt Lab (Open Source)
PromptForge is a visual AI prompt lab built using only open-source tools — no ChatGPT, no paid APIs, no external cloud dependencies.

It lets you visually explore and customize smart prompt workflows for different use cases — all in your browser.

✨ Features
🧠 Powered by LangFlow – for building visual prompt chains

🎨 Built with Builder.io for drag-and-drop frontend flexibility

⚡ TailwindCSS + Vite + Netlify-ready

📢 Multiple prompt templates included:

Marketing content generator

Code assistant

Art/image prompts

Learning/tutorial bots

🔧 Tech Stack
Frontend	Backend / Logic
Builder.io	LangFlow (visual LLM chains)
Vite	Node.js, Express
TailwindCSS	Ollama, LocalAI, or other OSS LLMs
Netlify (optional)	Local APIs – No external keys!

🚀 Getting Started
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/your-username/promptforge.git
cd promptforge
2. Install dependencies
bash
Copy
Edit
npm install
3. Start development server
bash
Copy
Edit
npm run dev
By default, this will start both the LangFlow backend and frontend locally.

🧩 Folder Structure
bash
Copy
Edit
zen-forge/
│
├── client/               # Frontend code (Builder + Tailwind)
├── server/               # Backend API + LangFlow integration
├── shared/               # Shared utilities and constants
├── public/               # Static assets
├── .env                  # Environment variables (local only)
├── package.json          # Project metadata and scripts
├── tailwind.config.ts    # TailwindCSS config
├── vite.config.ts        # Vite setup for frontend
└── vite.config.server.ts # Vite setup for backend
✅ To-Do / Improvements
 Add user authentication

 Export/share prompt templates

 Embed LangFlow editor in UI

 Dark mode & themes

💬 Want to try it?
Comment "PromptForge" or open an issue, and I’ll walk you through how to run it locally or deploy it yourself.
