// --- Helper: Generate CORS headers

import { MyConfig } from "./config";

export function corsHeaders(req: Request): HeadersInit {
    const origin = req.headers.get('origin') || "";
    const allowedOrigins = [MyConfig.devMode ? (MyConfig.devWebUrl ?? "http://localhost:3000") : (MyConfig.prodWebUrl ?? "http://localhost:3000")];
    const isAllowed = allowedOrigins.includes(origin);

    return {
        "Access-Control-Allow-Origin": isAllowed ? origin : "",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Credentials": "true",
    };
}