---
module-name: "Mermaid Diagram Viewer"
version: "1.0.0"
description: "Interactive web application for creating and visualizing Mermaid diagrams with real-time rendering"
architecture:
  style: "Component-based React Architecture"
  components:
    - name: "MermaidRenderer"
      description: "Core component managing state and orchestration"
    - name: "DiagramControls"
      description: "User input and customization interface"
    - name: "DiagramRenderer"
      description: "Mermaid.js integration and SVG handling"
development:
  setup:
    - step: "npm install"
    - step: "npm run dev"
---

# Mermaid Diagram Viewer - Tribal Knowledge

## Historical Context
This project started as a simple diagram viewer but evolved to handle complex diagram customization. The DiagramRenderer component's seemingly complex initialization delay (setTimeout 0) exists because early testing revealed race conditions with Mermaid.js initialization.

## Architecture Insights
- The panel collapse feature was added after users reported issues with small screens
- Font size controls are intentionally disabled for certain diagram types (sequence, state, er, journey) due to Mermaid.js rendering inconsistencies
- SVG export uses XMLSerializer instead of canvas because early tests showed better quality and maintainability

## Known Quirks
1. Theme Changes
   - Theme updates require full re-render due to Mermaid.js internals
   - Dark theme may render incorrectly if applied before initial diagram load

2. Performance Considerations
   - Large diagrams intentionally re-render on window resize for SVG scaling
   - Editor expansion state resets on theme change (known UX trade-off)

3. Browser Compatibility
   - IE11 support was dropped due to Mermaid.js dependencies
   - Safari requires additional error handling for SVG downloads

## Future-Proofing Notes
- The component structure anticipates future collaborative features
- Theme system designed for extension beyond built-in options
- Download handler prepared for additional export formats

## Integration Points
- Cloudflare Workers handle static asset delivery
- Component structure allows for potential CMS integration
- Export system ready for additional format handlers

## Common Gotchas
- Don't modify diagram state during render phase
- Theme changes require full Mermaid re-initialization
- SVG export requires rendered diagram state
