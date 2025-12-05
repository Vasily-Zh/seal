# CLAUDE.md

This file provides guidance for Claude Code when working with this project.

---

## Project Overview

Project: React + TypeScript stamp/seal design tool (visual constructor).

**Main features:**

* Add/edit/remove circular/text/icon/image elements on a canvas.
* Real-time preview and SVG rendering.
* Undo/redo via Zustand store.
* Export designs as PNG, SVG, or PDF.
* Template management system with categories and custom templates.
* Generator system for creating stamps with specific icons based on keywords.
* Layer management with drag-and-drop functionality.
* Advanced text and image vectorization for better export quality.
* Full text vectorization (curved and centered) preserving fonts in exports.
* Mobile-responsive interface with mobile-optimized controls.

**Tech Stack:**

* React 19 + TypeScript + Vite
* Zustand for state management
* lucide-react and Heroicons for icons
* imagetracerjs for raster-to-vector conversion

**Core Directories:**

```
src/
├── components/      # React components (Canvas, Controls, Toolbar, Layout, Header)
├── store/           # Zustand store for state and undo/redo
├── types/           # TypeScript types/interfaces
├── utils/           # Export and vectorization helpers
├── styles/          # Global CSS
public/
└── fonts/           # Google fonts
```

---

## Development Commands

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm lint         # Run ESLint on all files
npm preview      # Preview production build
```

---

## State & Components

* **Zustand store:** `src/store/useStampStore.ts` (elements, selectedElementId, canvasSize, history)
* **Canvas rendering:** `src/components/Canvas/Canvas.tsx` and elements/
* **Controls panel:** `src/components/Controls/Controls.tsx` + SliderInput
* **Toolbar:** `src/components/Toolbar/Toolbar.tsx` for element creation
* **Layout:** `src/components/Layout/MainLayout.tsx`
* **Header:** `src/components/Header/Header.tsx` (undo/redo/export)

**Key methods:** `addElement()`, `updateElement()`, `removeElement()`, `undo()`, `redo()`, `selectElement()`

---

## Navigation Start

**Start all project navigation from:** `map/main.md`

* `main.md` contains full project structure and links to section files.
* Follow links from `main.md` to locate specific code, components, or utilities.
* Update section files and `map/log` after any changes.
* Keep all navigation files compact to minimize token usage.

**Do not read automatically at startup:**

* `README.md`
* `PROJECT_MAP.md`
  These are reference files only; they provide background information and environment setup.

---

## Coding & Updates

* Always use store methods for state changes.
* Add new elements by creating a type, renderer, control panel, and toolbar button.
* Vectorize images via `src/utils/vectorize.ts`.
* Export using `src/utils/export.ts`.

**Logging Changes:**

* After any change, create a compact log file: `map/log/update-YYYYMMDD-HHMM.md`
* Include updated files, what was changed, and why.

---

## File References

**Navigation / Key files:**

```
map/main.md          # Main navigation entry
src/components/      # Canvas, Controls, Toolbar, Layout, Header
src/store/useStampStore.ts
src/types/index.ts
src/utils/export.ts
src/utils/vectorize.ts
```

* Keep all references minimal; rely on `main.md` for deeper navigation.
