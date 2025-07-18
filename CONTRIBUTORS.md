# Contributing Guidelines

Thank you for your interest in contributing to this project! Please follow these guidelines to help us maintain a clean, consistent, and collaborative codebase.

---

## 1. Feature Branching & Pull Requests

- **Feature Branching:**

  - For every new issue or feature, create a new branch from `main`.

- **Pull Requests (PRs):**
  - Open a PR to merge your branch into `main` when your work is ready.

---

## 2. Naming Conventions

- **Files & Folders:**

  - Use `camelCase` for file and folder names (e.g., `runnerCard/`, `useStravaStats.ts`).
  - Component files should be named after the component (e.g., `RunnerCard.tsx`).
  - CSS files should match their component (e.g., `RunnerCard.css`).

- **Components:**

  - Use `PascalCase` for React component names (e.g., `RunnerCard`, `RunnersGrid`).
  - Place each component in its own folder if it has related files (e.g., CSS, tests).

- **Hooks:**

  - Custom hooks are placed in `src/hooks/` and named with the `use` prefix (e.g., `useStravaStats.ts`).

---

## 3. File Structure Overview

```
src/
  assets/
    images/
      badges/
      ...
  components/
    badges/
    countdownTimer/
    runnerCard/
    ...
  hooks/
  utils/
  index.tsx
  index.css
```

- **`components/`**: All React components, grouped by feature or type.
- **`hooks/`**: Custom React hooks.
- **`utils/`**: Utility/helper functions and types.
- **`assets/`**: Images and static assets.

---

## 4. Component Patterns

- Use functional components with hooks.
- Keep components small, focused and reusable.
- Style components with matching CSS files.

---

## 5. Code Style

- Use ESLint and Prettier for code formatting and linting.

---

Thank you for helping us build a better project together!
