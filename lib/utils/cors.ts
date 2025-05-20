// --- Helper: Generate CORS headers

export function corsHeaders(req: Request): HeadersInit {
    const origin = req.headers.get('origin') || "";
    const allowedOrigins = ['http://localhost:4200'];
    const isAllowed = allowedOrigins.includes(origin);

    return {
        "Access-Control-Allow-Origin": isAllowed ? origin : "",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Credentials": "true",
    };
}