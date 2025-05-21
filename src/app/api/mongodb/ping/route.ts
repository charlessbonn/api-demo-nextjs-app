import { connectToMongoDBS1 } from "../../../../../mongodb";

export async function GET(
    // req: Request,
) {
    try {
        const db = await connectToMongoDBS1();
        // const data = await db.collection(colName).findOne({ connection: "Connected to server" });
        // const data = await db.collection(colName).find({ connection: "Connected to server" }).toArray();
        const data = await db.collection("test").find({}).toArray();

        return new Response(JSON.stringify({ data }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}