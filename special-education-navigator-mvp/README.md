# Special Education Navigator MVP: Technical Report

## 1. Executive Summary
The **Special Education Navigator** is a high-fidelity AI-driven decision-support tool designed for parents and educators navigating the Individuals with Disabilities Education Act (IDEA). By combining the generative capabilities of Gemini 3 Flash with real-time Google Search grounding, the MVP provides state-specific, legally-aware guidance that minimizes "hallucination" and maximizes regulatory accuracy.

## 2. Technical Architecture
### Frontend Layer
- **Framework**: React 19 (Strict Mode).
- **Styling**: Tailwind CSS + Glassmorphism.
- **Icons**: Lucide React for consistent visual language.
- **Markdown**: React-Markdown for rendering structured legal guidance with active citations.

### Intelligence Layer (The Gemini Core)
- **Model**: `gemini-3-flash-preview` for high-speed reasoning and massive context windows.
- **Tooling**: `googleSearch` grounding enabled for real-time verification of state statutes.
- **State Selection Logic**: A "Jurisdictional Anchor" pattern where the system prompt is dynamically re-hydrated based on the user's selected US State.

## 3. Implementation Details
### State-Specific Logic
The application uses a `SYSTEM_INSTRUCTION_TEMPLATE` that injects:
1. **Local Timelines**: Verified via Search for specific evaluation windows (e.g., 60 days in CA vs 45 days in other states).
2. **Local PTI Referrals**: Direct links to state-mandated Parent Training and Information Centers.

### Search Grounding Flow
1. **User Query**: "What is the timeline for an IEP evaluation in Texas?"
2. **AI Action**: Gemini executes a search query for "Texas TEA IEP evaluation timelines".
3. **Synthesis**: The model combines its internal training with search results.
4. **Attribution**: Grounding metadata is parsed to display "Verified Source" badges in the UI.

## 4. GitHub Integration & Troubleshooting
If you encounter **Authentication Errors** when saving to GitHub, follow these steps:

### A. Verify Scopes
Ensure your GitHub Personal Access Token (PAT) has the following permissions:
- `repo` (Full control of private repositories)
- `workflow` (Required if using GitHub Actions)

### B. Reset Credentials (CLI)
Run these commands in your terminal to force a credential refresh:
```bash
git config --global --unset user.password
git remote set-url origin https://<YOUR_TOKEN>@github.com/USERNAME/REPO_NAME.git
```

### C. Large File Issues
If the sync hangs, ensure `node_modules` is ignored:
- Check your `.gitignore` for `node_modules/` and `dist/`.
- Run `git rm -r --cached .` followed by `git add .` to clear out mistakenly tracked large files.

## 5. Security & Privacy
- **Client-Side Safety**: API Keys are handled via `process.env` and injected at build time.
- **Context Isolation**: Chat sessions are cleared upon jurisdiction reset to prevent cross-state regulation confusion.

---
*Disclaimer: This tool provides educational information and is not a substitute for professional legal advice.*
