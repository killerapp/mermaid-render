# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on port 31111)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture Overview

This is a Next.js application that provides an interactive Mermaid diagram editor and renderer. The application consists of:

1. **Main Application Structure**: Single-page application with the main component `MermaidRenderer` rendering the entire interface
2. **Component Architecture**:
   - `MermaidRenderer.jsx`: Main container component managing state and layout
   - `DiagramControls.jsx`: Left panel for diagram editing and theming controls
   - `DiagramRenderer.jsx`: Right panel for displaying rendered Mermaid diagrams
3. **Deployment**: Configured for Cloudflare Workers with static asset serving via `_worker.js`

## Key Implementation Details

- **Mermaid Integration**: Uses mermaid v11.4.1 for diagram rendering
- **Styling**: Tailwind CSS for all UI components with responsive design
- **State Management**: React hooks for managing diagram content, themes, fonts, and panel layout
- **Export Functionality**: SVG download capability built into the main renderer
- **Custom Webpack Config**: Includes fallback configuration for browser compatibility (disables 'fs' module)
- **Panel Resizing**: Interactive resizable panels with mouse drag functionality

## Project Structure

- `pages/index.js`: Entry point that renders the main MermaidRenderer component
- `components/`: All React components for the application
- `utils/mermaidVersion.js`: Utility for version management
- `_worker.js`: Cloudflare Workers configuration for API routes and static serving