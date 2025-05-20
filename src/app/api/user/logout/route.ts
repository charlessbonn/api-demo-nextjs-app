import { cookies } from "next/headers";
import { authVerifyUserToken } from "../../../../../lib/utils/auth-jwt";
import { MyConfig } from "../../../../../lib/utils/config";
import { connectToMongoDBS1 } from "../../../../../mongodb";
import { corsHeaders } from "../../../../../lib/utils/cors";

export async function OPTIONS(req: Request) {
    return new Response(null, {
        status: 204,
        headers: corsHeaders(req),
    });
}

export async function POST(
    // req: Request,
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: 'No token' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const tokenData = authVerifyUserToken(token ?? "N/A");

        const db = await connectToMongoDBS1();
        // const user = await db.collection(MyConfig.colNameAdmin ?? "N/A").findOne({email: email ?? "N/A"});
        await db.collection(MyConfig.colNameAdmin ?? "N/A").findOneAndUpdate(
            { email: tokenData?.user?.email ?? "N/A" },         // Filter (what to find)
            { $set: { logout_at: (new Date()).toISOString() } }, // Update operation
            { returnDocument: 'after' }    // Options
        );

        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}