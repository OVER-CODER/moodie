
import { app, httpServer } from "../server/index";
import { registerRoutes } from "../server/routes";

// Initialize routes for the serverless function
// Note: In serverless, we don't listen on a port. Vercel handles the request.
// We just need to ensure routes are registered.

// We need to await registerRoutes, but Vercel expects a synchronous export or a promise that resolves to the handler.
// Express 'app' is a request handler.

let routesRegistered = false;

export default async function handler(req: any, res: any) {
    if (!routesRegistered) {
        await registerRoutes(httpServer, app);
        routesRegistered = true;
    }

    // Forward to Express app
    return app(req, res);
}
