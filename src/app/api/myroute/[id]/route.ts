/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log(req.method);

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
