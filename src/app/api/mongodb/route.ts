/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToMongoDBS1 } from '../../../../mongodb';
import { Collection } from 'mongodb';

export async function GET(
    req: Request,
) {
    try {
        const { searchParams } = new URL(req.url);
        const colName = searchParams.get('colName');

        if (!colName) {
            return new Response(JSON.stringify({ message: "Invalid collection name" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const db = await connectToMongoDBS1();
        // const data = await db.collection(colName).findOne({ connection: "Connected to server" });
        // const data = await db.collection(colName).find({ connection: "Connected to server" }).toArray();
        const data = await db.collection(colName).find({}).toArray();

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

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();
        const { colName } = body;

        if (!colName) {
            return new Response(JSON.stringify({ message: "Invalid collection name" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const db = await connectToMongoDBS1();
        const result: Collection<Document> = await db.createCollection(colName);
        // const result: InsertOneResult<Document> = await db.collection("test").insertOne({ connection: "Connected to server"});

        const data = `New collection created: ${result.collectionName}`;
        // const data = `New item created: ${result.insertedId}`;

        return new Response(JSON.stringify({ message: data }), {
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