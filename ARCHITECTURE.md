# Architecture Note

## Priorities & Philosophy
Given the 4-6 hour timebox and the goal of demonstrating product engineering, the primary focus was on **speed to value, reliable local setup, and core functionality**. The architecture was kept intentionally simple to ensure reviewers could test it with zero configuration.

## Key Decisions

1. **Next.js App Router**: Chosen for its built-in routing, server actions, and ease of creating full-stack capabilities within a single repository. Server Actions allowed us to bypass building a separate API layer, accelerating feature delivery like saving and sharing.
2. **SQLite + Prisma**: The instructions stated "Do not require reviewers to pay for a dependency or service". By using SQLite, reviewers do not need to configure Docker or spin up a Postgres database. Prisma provides a robust schema definition and type-safe queries.
3. **TipTap for Rich Text**: Instead of building a complex contenteditable solution from scratch, TipTap provides a highly reliable, customizable headless editor. It allows us to easily support bold, italic, headings, and lists, while emitting clean HTML.
4. **Mock Authentication via Cookies**: Implementing a full OAuth or credential-based auth system would consume a significant portion of the timebox. I opted for a mock user switcher that sets a server-readable cookie (`mock_user_id`). This simulates session state across the app seamlessly.
5. **Debounced Auto-Save**: To provide a Google Docs-like feel without overwhelming the database with updates on every keystroke, the editor uses a 1-second debounce before triggering the Server Action to save the document.

## Deprioritized / Out of Scope
- **Real-time Collab**: True CRDT-based real-time collaboration (e.g., Yjs) was excluded due to the complexity of setting up WebSockets or a sync server within the timebox.
- **Complex Permissions**: The sharing model grants full access (WRITE). Granular permissions (READ vs WRITE vs COMMENT) were omitted for simplicity.
