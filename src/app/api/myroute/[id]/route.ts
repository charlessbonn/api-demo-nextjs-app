/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
): Promise<Response> {
    const { id } = await params;

    try {
        return new Response(
            JSON.stringify({ message: `Connected to route with id: ${id}` }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error: unknown) {
        return new Response(
            JSON.stringify({ message: `Something went wrong. ERR: ${String(error)}` }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
