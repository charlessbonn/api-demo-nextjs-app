/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    message: any;
};

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        return new Response(JSON.stringify({ message: "Connected myroute" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}