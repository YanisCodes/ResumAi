# ResumAi 🤖

> AI-powered CV generator tailored for students and job seekers.

ResumAi helps you generate a professional, ATS-friendly CV in seconds using AI. Just fill in your details and get a clean, structured resume ready to download as PDF.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## ✨ Features

- **AI-generated CVs** — Powered by Llama 3.3 70B via Groq API
- **ATS-friendly format** — Clean, structured layout that passes applicant tracking systems
- **PDF export** — Download your CV instantly as a PDF
- **100% free** — No account required, no hidden fees
- **Fast** — Generate a professional CV in under 10 seconds

## 🛠️ Tech Stack

- **Frontend & Backend** — Next.js 15 (App Router)
- **AI Model** — Llama 3.3 70B via Groq API
- **Styling** — Tailwind CSS
- **PDF Export** — jsPDF + html2canvas
- **Deployment** — Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/ResumAi.git
cd ResumAi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Groq API key to .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file at the root of the project:

```
GROQ_API_KEY=your_groq_api_key_here
```

## 📁 Project Structure

```
ResumAi/
├── app/
│   ├── api/
│   │   └── generate-cv/
│   │       └── route.js      # Backend — Groq API call
│   ├── page.js               # Frontend — Form + CV display
│   └── layout.js
├── .env.local                # API keys (never commit this)
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT License — feel free to use this project for anything.

---

Built with ❤️ by YanisCodes (https://github.com/YanisCodes)
