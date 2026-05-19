# CampusConnect — Design System & Figma Integration Rules

## Project Overview

- **App:** CampusConnect — Social media platform for campus communities
- **Frontend:** React 19 + Vite 8 + Tailwind CSS 4 + Framer Motion
- **Icons:** Lucide React (IMPORTANT: do NOT install other icon libraries)
- **State:** Zustand
- **Fonts:** Manrope (primary), Poppins, Baloo 2, Sail (decorative)
- **Theme:** Dark mode (background `#0a0010`), purple brand (`#9719fd` / `#7C3AED`)

---

## Component Organization

| Category | Path | Purpose |
|----------|------|---------|
| UI primitives | `src/components/ui/` | Buttons, inputs, modals, toasts, pickers |
| Layout | `src/components/layout/` | Navbar, Footer, page shells |
| Dashboard | `src/components/dashboard/` | Dashboard-specific panels and sections |
| Landing sections | `src/components/sections/` | Hero, About, Community, Contact, etc. |
| Common/shared | `src/components/common/` | Reusable cross-feature components |
| Pages | `src/pages/` | Route-level page components |

- IMPORTANT: Check existing components before creating new ones
- New UI primitives go in `src/components/ui/`
- New page sections go in `src/components/sections/` or `src/components/dashboard/`

---

## Design Tokens

All tokens are defined in `src/index.css` as CSS custom properties:

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-purple` | `#7C3AED` | Primary brand, borders, accents |
| `--color-brand-violet` | `#9719fd` | Gradients, glows, highlights |
| `--color-bg` | `#0a0010` | Page background |
| `--color-cta` | `#22C55E` | Call-to-action buttons |

### Fonts

| Token | Value |
|-------|-------|
| `--font-manrope` | `'Manrope', sans-serif` — body text, UI |
| `--font-poppins` | `'Poppins', sans-serif` — headings |
| `--font-baloo` | `'Baloo 2', cursive` — playful accents |
| `--font-sail` | `'Sail', cursive` — decorative |

### Utility Classes

- `.font-manrope`, `.font-poppins`, `.font-baloo`, `.font-sail`
- `.cursor-pointer` — all clickable elements
- `.animate-fade-in`, `.animate-fade-up`, `.animate-float`, `.animate-glow`, `.animate-orb`

---

## Styling Rules

- IMPORTANT: Use Tailwind utility classes as the primary styling approach
- IMPORTANT: Never hardcode colors — use CSS variables or Tailwind theme extensions
- Use `clsx` + `tailwind-merge` for conditional class composition
- Animations use Framer Motion for complex interactions, CSS keyframes for simple loops
- All transitions: 150–300ms ease
- Dark theme is the default — all components must look correct on `#0a0010` background
- Glass/frosted effects: `backdrop-blur` + semi-transparent backgrounds (`rgba(255,255,255,0.05)`)
- Glow effects: `box-shadow` with purple/violet at varying opacities

---

## Component Patterns

### Naming

- PascalCase for component files: `FeedSection.jsx`, `DashNavbar.jsx`
- Default exports for all components
- Props destructured in function signature

### Structure

```jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconName } from 'lucide-react';

const ComponentName = ({ prop1, prop2 }) => {
  // hooks
  // handlers
  // render
  return (
    <motion.div>
      {/* content */}
    </motion.div>
  );
};

export default ComponentName;
```

### Animation Pattern

- Page transitions: `AnimatePresence` + `motion.div` with opacity/y transforms
- Hover states: `whileHover`, `whileTap` on motion elements
- Scroll reveals: `initial` + `whileInView` with stagger on children
- IMPORTANT: Respect `prefers-reduced-motion`

---

## Figma MCP Integration Rules

These rules define how to translate Figma inputs into code for this project.

### Required Flow (do not skip)

1. Run `get_design_context` first to fetch the structured representation for the exact node(s)
2. If the response is too large or truncated, run `get_metadata` to get the high-level node map, then re-fetch only the required node(s) with `get_design_context`
3. Run `get_screenshot` for a visual reference of the node variant being implemented
4. Only after you have both `get_design_context` and `get_screenshot`, download any assets needed and start implementation
5. Translate the output into this project's conventions: React + Tailwind + Framer Motion + Lucide icons
6. Validate against Figma for 1:1 look and behavior before marking complete

### Implementation Rules

- Treat Figma MCP output as a design spec, not final code
- Replace generic Tailwind colors with project tokens (`--color-brand-purple`, etc.)
- Reuse existing components from `src/components/` instead of duplicating
- Use Framer Motion for animations (not CSS-only unless trivial)
- Use Lucide React for all icons — do NOT add new icon packages
- All interactive elements need `cursor-pointer`
- Maintain dark theme compatibility
- Strive for 1:1 visual parity with the Figma design

---

## Asset Handling

- IMPORTANT: If the Figma MCP server returns a localhost source for an image or SVG, use that source directly
- IMPORTANT: DO NOT import/add new icon packages — use Lucide React or assets from Figma payload
- IMPORTANT: DO NOT use or create placeholders if a localhost source is provided
- Store downloaded image assets in `src/assets/`
- SVG icons should use Lucide React components when a match exists

---

## Project-Specific Conventions

### Routing

- React Router DOM v7 with `BrowserRouter`
- Protected routes check `useAuthStore().isAuthenticated`
- Redirect unauthenticated users to `/`

### State Management

- Zustand stores in `src/store/`
- Auth state: `src/store/authStore.js`
- Theme state: `src/store/themeStore.js`

### API Layer

- Axios-based services in `src/api/`
- Base config in `src/api/axios.js`
- One service file per domain: `authService.js`, `postService.js`, `eventService.js`, etc.

### Accessibility

- IMPORTANT: All interactive elements must have visible focus states
- Minimum 4.5:1 contrast ratio for text
- Keyboard navigation support on all interactive elements
- `aria-label` on icon-only buttons
- `prefers-reduced-motion` respected for animations

### Responsive Breakpoints

- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Large: 1440px
- IMPORTANT: No horizontal scroll on mobile

---

## Anti-Patterns (NEVER do these)

- ❌ Emojis as icons — use Lucide React SVGs
- ❌ Hardcoded hex colors — use CSS variables
- ❌ Missing `cursor-pointer` on clickable elements
- ❌ Layout-shifting hover transforms
- ❌ Instant state changes without transitions
- ❌ Invisible focus states
- ❌ Installing new icon/font packages without approval
- ❌ Light-mode-only components (dark theme is default)
- ❌ Inline styles for layout (use Tailwind)

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] Uses existing components where possible
- [ ] No emojis as icons (Lucide React only)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover/focus states with smooth transitions (150–300ms)
- [ ] Text contrast ≥ 4.5:1 on dark background
- [ ] Keyboard navigation works
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Framer Motion for meaningful animations
- [ ] Dark theme compatible
