/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

type Data = {
    message: any;
};

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const data = "Connected myroute";
        // Create ETag (hash of response body)
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        // Compare client ETag
        const clientETag = req.headers['if-none-match'];

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