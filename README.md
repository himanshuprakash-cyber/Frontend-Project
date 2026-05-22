# Sciqus Studio

Sciqus Studio is a React and Vite dashboard built to show a realistic frontend assignment instead of a placeholder mockup. It focuses on working navigation, stateful interactions, theme persistence, and a responsive layout that stays readable on desktop and mobile.

## What It Shows

- Real sidebar navigation with page switching
- Light and dark mode that persists in the browser
- Search, export, modal, and toast interactions that all do something useful
- A desktop layout that follows the provided ratios and a mobile layout that stacks cleanly
- Reusable components for the header, sidebar, cards, charts, and action panels

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React

## Run It

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://127.0.0.1:5173`.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint across the project

## File Map

- `src/App.jsx` - application state, page data, and action wiring
- `src/components/` - reusable UI pieces for the dashboard
- `src/index.css` - theme tokens, layout grid, and utility styling
- `index.html` - metadata, fonts, and theme bootstrapping

## Notes

- The project is frontend-only, so it runs without a backend.
- Settings and theme choices are stored locally in the browser.
- The content is intentionally written like a real assignment review rather than a generic SaaS demo.
