# AI-Native Workflow Note

## Tools Used
- Google's Advanced Agentic Coding Assistant (Antigravity)
- Next.js documentation and Tailwind CSS documentation.

## How AI Materially Sped Up My Work
1. **Boilerplate & Scaffolding**: AI quickly generated the Prisma schema, seed scripts, and basic UI components (like the Dashboard grid and Tailwind classes), turning hours of typing into minutes.
2. **Component Generation**: Building the TipTap editor component with the custom toolbar and debounce logic was significantly faster. The AI understood the requirement for auto-saving and generated the `useDebounce` hook integration seamlessly.
3. **Context Switching**: Having the AI agent execute terminal commands (like `npx create-next-app` and Prisma CLI commands) directly while I focused on the architecture and next steps kept me in a high-level product engineering mindset.

## AI Adjustments & Rejections
- **Prisma V8 Compatibility**: The AI initially attempted to use the newly released Prisma v8 RC which had changed CLI flags (e.g., removing `db push` in favor of different workflows, and breaking commonjs exports for the seed file). I directed the AI to downgrade to a stable Prisma v5 version to avoid rabbit holes and ensure a reliable build for the reviewer.
- **Authentication Scope**: The AI initially suggested NextAuth. I rejected this in the planning phase and opted for a simpler cookie-based mock switcher to aggressively cut scope and ensure zero setup for the reviewer.

## Verification
- **Visual Checks**: Ran the development server to ensure Tailwind styling looked modern and clean.
- **Flow Testing**: Manually tested creating, saving, uploading files, and sharing documents between the seeded users (Alice, Bob, Charlie).
- **Automated Testing**: Directed the AI to write a Node native test runner script for the critical database layer to ensure queries and relations worked perfectly.
