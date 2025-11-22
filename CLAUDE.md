# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript stamp/seal design tool (visual constructor for creating circular stamps and seals). It allows users to add elements (circles, text, icons, images) to a canvas, customize their properties, preview changes in real-time, vectorize raster images, and export designs as PNG or SVG.

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
The app uses a 4-column flexbox layout via `MainLayout.tsx`:
- **Toolbar** (left, 140px): Buttons to add circles, text, icons, images, and vectorize raster images
- **Element List** (25%): List of all elements in the design with visibility toggles
- **Element Settings** (25%): Properties panel to edit selected element (displayed via Controls component)
- **Preview** (remaining space): SVG canvas with real-time rendering

### State Management
Uses Zustand store (`src/store/useStampStore.ts`) for centralized state:
- **elements**: Array of all stamp elements (circles, text, shapes, images, icons)
- **selectedElementId**: Currently selected element for editing
- **canvasSize**: Default 100mm stamp size (rendered as 600px SVG for display)
- **history**: Undo/redo stack with 50-step limit

Key store methods: `addElement()`, `updateElement()`, `removeElement()`, `undo()`, `redo()`, `selectElement()`

### Component Organization

```
src/components/
├── Canvas/                    # SVG canvas rendering
│   ├── Canvas.tsx            # Main SVG with grid, rulers, and elements
│   └── elements/             # Element renderers
│       ├── CircleElement.tsx
│       ├── TextElement.tsx
│       ├── TextCenteredElement.tsx
│       ├── RectangleElement.tsx
│       ├── ImageElement.tsx
│       └── IconElement.tsx
├── Controls/                 # Property editing panels
│   ├── Controls.tsx          # Main panel routing to element-specific controls
│   └── SliderInput.tsx       # Reusable number input with slider
├── Header/                   # App branding and settings
│   ├── Header.tsx
│   └── SettingsModal.tsx
├── Layout/                   # Layout wrapper (4-column flexbox)
│   └── MainLayout.tsx
├── Toolbar/                  # Element creation buttons and modals
│   ├── Toolbar.tsx
│   ├── IconGalleryModal.tsx  # Browse icon libraries (Lucide, Heroicons)
│   ├── IconSearchModal.tsx   # Search icons by keyword
│   └── VectorizeModal.tsx    # Convert raster images to SVG
```

### Type System
All types defined in `src/types/index.ts`. Key interfaces:
- **BaseElement**: Base interface for all elements (id, type, x, y, visible)
- **CircleElement**: Circle with stroke width, color, dash array, and optional fill
- **TextElement**: Text with font, size, color, curved-text support, letter spacing, bold/italic, flipped
- **TextCenteredElement**: Centered text without curve support
- **IconElement**: SVG icons from Lucide, Heroicons, or custom SVG with configurable fill/stroke
- **ImageElement**: Raster or SVG images embedded in the design
- **TriangleElement, RectangleElement, LineElement**: Shapes (defined but not all fully implemented)

### Canvas Implementation
- SVG-based (not Canvas API)
- 5mm grid with rulers on top/left edges
- Default size: 100mm × 100mm (rendered as 600px square for display)
- Coordinates in millimeters, scaled to pixels for SVG rendering
- Elements rendered in array order (later elements appear on top)

### Icon System
Two icon libraries integrated:
- **Lucide React** (lucide-react): Modern icon set
- **Heroicons** (@heroicons/react): Tailwind's icon set

Icons are handled via `IconElement` which supports:
- Dynamic icon selection from galleries or search
- Custom SVG content for user-uploaded icons
- Fill and stroke color customization
- `extractSvgFromIcon.ts` utility extracts raw SVG from React icon components

### Image Vectorization
Uses `imagetracerjs` library to convert raster images to SVG:
- Three quality presets: low, medium, high (affects path detail and file size)
- Configurable color count (impacts color fidelity vs simplicity)
- Utilities in `src/utils/vectorize.ts`: `vectorizeImageFile()`, `getSvgComplexity()`, `getSvgSize()`
- VectorizeModal provides UI for upload, preview, and quality adjustment

### Export System (`src/utils/export.ts`)
- **PNG Export**: Converts SVG to PNG using canvas, applies 2x scale for quality
- **SVG Export**: Direct SVG download with proper XML namespacing

### Fonts (`src/utils/fonts.ts`)
Google Fonts loaded via `index.html`:
- Serif: Times New Roman, Playfair Display, Merriweather, Lora, PT Serif, Crimson Text
- Sans-serif: Arial, Roboto, Open Sans, Montserrat, Raleway, Ubuntu

Font names must match Google Fonts exactly (spaces handled in CSS).

## Key Development Notes

### Adding New Element Types
1. Define interface in `src/types/index.ts` extending `BaseElement`
2. Create renderer in `src/components/Canvas/elements/YourElement.tsx`
3. Add case in Canvas.tsx's element mapping
4. Add control panel in `src/components/Controls/Controls.tsx` for element editing
5. Update Toolbar to add creation button if needed

### Modifying State
Always use Zustand store methods (`useStampStore()`) rather than direct mutations:
- Call `saveToHistory()` after changes to enable undo/redo
- Selected element updates trigger automatic re-renders via React hooks

### Working with Icons
- Icon components from libraries are converted to raw SVG strings using `extractSvgFromIcon.ts`
- Custom SVG icons are stored directly in `IconElement.svgContent`
- Icons are rendered by parsing SVG string and injecting it into the canvas

### Styling
Inline styles used throughout components. No CSS preprocessor or CSS-in-JS library configured. Global styles in `src/index.css` and `src/App.css`.

### TypeScript Configuration
- Strict mode enabled (noImplicitAny, strictNullChecks, noUnusedLocals, noUnusedParameters, etc.)
- Target: ES2022 for app code
- Bundler mode with Vite

## Dependencies
- **react** (19.2.0): UI framework
- **react-dom** (19.2.0): React DOM rendering
- **zustand** (5.0.8): Lightweight state management
- **lucide-react** (0.554.0): Modern SVG icon library
- **@heroicons/react** (2.2.0): Tailwind UI icon library
- **imagetracerjs** (1.2.6): Raster-to-vector image conversion
- **vite** (7.2.4): Fast dev server and build tool
- **typescript** (~5.9.3): Static type checking
