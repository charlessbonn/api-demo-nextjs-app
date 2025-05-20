/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';

export async function GET(
    req: Request,
) {
    try {
        const data = "Connected ping";
        // Create ETag (hash of response body)
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        // Compare client ETag
        const clientETag = req.headers.get('if-none-match');

        if (clientETag === `"${etag}"`) {
            // Data has not changed, send 304
            return new Response(null, {
                status: 304,
            });
        }

        return new Response(JSON.stringify({ message: data }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600',
                'ETag': `"${etag}"`
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}