# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript stamp/seal design tool (visual constructor for creating circular stamps and seals). It allows users to add elements (circles, text) to a canvas, customize their properties, preview changes in real-time, and export designs as PNG or SVG.

## Common Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production (runs type-check then bundles)
npm run build

# Run ESLint on all files
npm lint

# Preview production build
npm preview
```

## Architecture Overview

### Layout Structure
The app uses a 3-section flexbox layout via `MainLayout.tsx`:
- **Header** (top): Application title and branding
- **Main Content** (middle):
  - **Toolbar** (left, 100px): Buttons to add circles and text elements
  - **Controls** (center, 60%): Properties panel to edit selected element
  - **Canvas** (right, 40%): SVG preview of the stamp design
- **Footer** (implicit): Not yet implemented

### State Management
Uses Zustand store (`src/store/useStampStore.ts`) for centralized state:
- **elements**: Array of all stamp elements (circles, text, shapes, images)
- **selectedElementId**: Currently selected element for editing
- **canvasSize**: Default 100mm stamp size (rendered as 600px SVG for display)
- **history**: Undo/redo stack with 50-step limit

Key store methods: `addElement()`, `updateElement()`, `removeElement()`, `undo()`, `redo()`, `selectElement()`

### Component Organization

```
src/components/
├── Canvas/              # SVG canvas rendering
│   ├── Canvas.tsx      # Main SVG with grid, rulers, and elements
│   └── elements/       # Element renderers
│       ├── CircleElement.tsx
│       └── TextElement.tsx
├── Controls/           # Property editing panels
│   ├── Controls.tsx    # Main panel routing to element-specific controls
│   └── SliderInput.tsx # Reusable number input with slider
├── Header/             # App branding
├── Layout/             # Layout wrapper (3-section flexbox)
├── Toolbar/            # Element creation buttons
```

### Type System
All types defined in `src/types/index.ts`. Key interfaces:
- **StampElement**: Base interface for all elements (id, type, x, y)
- **CircleElement**: Extends StampElement with stroke width and color
- **TextElement**: Text with font, size, color, curved-text support
- **TriangleElement, RectangleElement, LineElement, ImageElement**: Defined but not yet rendered

### Canvas Implementation
- SVG-based (not Canvas API)
- 5mm grid with rulers on top/left edges
- Default size: 100mm × 100mm (rendered as 600px square for display)
- Coordinates in millimeters, scaled to pixels for SVG rendering

### Export System (`src/utils/export.ts`)
- **PNG Export**: Converts SVG to PNG using canvas, applies 2x scale for quality
- **SVG Export**: Direct SVG download with proper XML namespacing and font URLs embedded

### Fonts (`src/utils/fonts.ts`)
10 Google Fonts loaded via `index.html`:
- Serif: Merriweather, Lora, Playfair Display, Cormorant
- Sans-serif: Roboto, Open Sans, Ubuntu, Inter, Quicksand, Montserrat

Font names must match Google Fonts exactly (spaces handled in CSS).

## Key Development Notes

### Adding New Element Types
1. Define interface in `src/types/index.ts` extending `StampElement`
2. Create renderer in `src/components/Canvas/elements/YourElement.tsx`
3. Add case in Canvas.tsx's element mapping
4. Add control panel in `src/components/Controls/` if element is editable
5. Update Toolbar to add creation button if needed

### Modifying State
Always use Zustand store methods (`useStampStore()`) rather than direct mutations:
- Call `saveToHistory()` after changes to enable undo/redo
- Selected element updates trigger automatic re-renders via React hooks

### Styling
Currently uses inline styles in component files. No CSS preprocessor or CSS-in-JS library configured. Global styles in `src/index.css` and `src/App.css`.

### TypeScript Configuration
- Strict mode enabled (`noImplicitAny: true`, `strictNullChecks: true`, etc.)
- Target: ES2022 for app code
- Unused variable warnings enabled

## Testing
No testing framework currently configured. Consider adding Vitest for future test coverage.

## Dependencies
- **react** (19.2.0): UI framework
- **react-dom** (19.2.0): React DOM rendering
- **zustand** (5.0.8): Lightweight state management (chosen for simplicity)
- **lucide-react** (0.554.0): SVG icon library
- **vite** (7.2.4): Fast dev server and build tool
- **typescript** (~5.9.3): Static type checking
