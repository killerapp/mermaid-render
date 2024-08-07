export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        // Handle API routes
        return new Response('API functionality not implemented', { status: 501 });
      }
      // Serve static assets
      return env.ASSETS.fetch(request);
    },
  };