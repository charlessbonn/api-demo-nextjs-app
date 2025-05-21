/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest } from "next/server";

interface Params {
    id: string;
}

interface Props {
    params: Params;
}

export async function GET(
    req: NextRequest,
    { params }: Props
) {
    console.log(req.method);
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
