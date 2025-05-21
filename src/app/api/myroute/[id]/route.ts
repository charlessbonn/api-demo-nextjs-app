/* eslint-disable @typescript-eslint/no-explicit-any */

interface Params {
    id: string;
}

interface Props {
    params: Params;
}

export async function GET(
    req: Request,
    { params }: Props
): Promise<Response> {
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
