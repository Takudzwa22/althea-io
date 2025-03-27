# Althea.io – AI News Fact Checker

Althea.io is a web-based AI-powered tool that helps users verify the accuracy and bias of online news articles. Built using modern web technologies like **Next.js**, **Tailwind CSS**, and **React**, the application empowers users to critically assess digital content in real-time.

## 🌐 Live Demo

https://altheaio.vercel.app/

## 📂 GitHub Repository Structure

├── app/ │ ├── page.tsx # Home and dashboard pages │ └── layout.tsx # Root layout and global theme ├── components/ # UI components (e.g., VerifyForm) ├── public/ # Static assets ├── styles/ │ └── globals.css # Tailwind + custom styles ├── tailwind.config.ts # Tailwind configuration ├── tsconfig.json # TypeScript configuration ├── postcss.config.mjs # PostCSS plugins ├── next.config.mjs # Next.js settings ├── package.json # Dependencies and scripts ├── .gitignore └── README.md


---

## 🧠 Project Idea

Althea.io was built to address the growing concern of misinformation and bias in online news. With AI analysis, it flags bias levels and ideological leanings in articles submitted by users, making the web a safer place for information.

---

## 🛠 Tech Stack

- **Frontend:** React, Next.js, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, lucide-react
- **Forms:** react-hook-form
- **Charts & Stats:** recharts
- **Deployment:** Vercel-ready
- **Package Manager:** pnpm

---

## 🧪 How to Run Locally

1. **Install dependencies:**
   ```bash
   pnpm install
Start development server:

bash
Copy
Edit
pnpm dev
Build for production:

bash
Copy
Edit
pnpm build
✨ Features
Article verification with bias scoring

Dashboard for tracking past verifications

Clean UI with light/dark theme support

Accessible and responsive across devices

Modular component-based architecture

🔐 Security Considerations
Input validation to prevent XSS

Rate-limiting (to be added in production)

Minimal data persistence (privacy-focused)

📈 Future Improvements
Integration with NLP models or external AI APIs

Visualization enhancements for bias graphs

User accounts and saved history

Feedback loop for model improvement

👥 Contributors
[Your Name 1] – Frontend & Logic

[Your Name 2] – UI/UX & Testing

📜 License
MIT License

"Verify news articles with confidence."
— Althea.io Team
