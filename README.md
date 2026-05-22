# Vortex Dashboard

A polished, responsive dashboard built with React and Vite for showcasing product metrics, team activity, and workspace actions in one clean interface.

## Overview

This project was designed to feel more like a real product than a static assignment. It includes functional navigation, interactive controls, theme persistence, and a responsive layout that adapts cleanly from desktop to mobile.

## Highlights

- Functional sidebar navigation with page switching
- Persistent light and dark mode
- Responsive desktop and mobile layouts
- Interactive cards, actions, modals, and toasts
- Clean, professional dashboard styling with reusable components
- Export and reset actions for a more realistic workflow

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://127.0.0.1:5173`.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint across the project

## Project Structure

- `src/App.jsx` - dashboard state, layout, and interactions
- `src/components/` - reusable UI blocks such as sidebar, header, cards, and modal
- `src/index.css` - global styles and theme tokens
- `index.html` - document metadata and theme bootstrapping

## Notes

- The UI is fully frontend-driven and does not require a backend to run.
- Theme and settings are stored locally in the browser for a more realistic user experience.
- The layout has been tuned to remain usable on both desktop and mobile screens.
