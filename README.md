# Collab Docs

A lightweight collaborative document editor built as part of the AI-Native Full Stack Developer Assignment.

## Features
- **Rich Text Editing**: Powered by TipTap. Support for bold, italic, headings, and lists. Auto-saves changes.
- **File Upload**: Upload `.md` or `.txt` files directly from the dashboard to create new documents instantly.
- **Sharing**: Grant other users read/write access to your documents.
- **Mock Authentication**: Quick dropdown in the navigation bar to switch between seeded users (Alice, Bob, Charlie).

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS v4
- **Editor**: TipTap (Headless wrapper around ProseMirror)
- **Database**: SQLite (via Prisma ORM) for zero-config local development.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Initialize the SQLite database and seed mock users:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests
Run the automated database test via Node's native test runner:
```bash
node --test src/db.test.js
```
