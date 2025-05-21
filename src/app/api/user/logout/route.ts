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

        // Set cookie
        (await
            // Set cookie
            cookies()).set('auth-token', '', {
                httpOnly: true,
                secure: !MyConfig.devMode, // false for localhost
                sameSite: 'none',
                maxAge: 0, // 1 day
            });
        (await
            // Set cookie
            cookies()).set('user-session', '', {
                httpOnly: false,
                secure: !MyConfig.devMode, // false for localhost
                sameSite: 'none',
                maxAge: 0, // 1 day
            });

        return new Response(null, { status: 204 });
    } catch (error) {
        if (error?.toString().includes('TokenExpiredError')) {
            // Set cookie
            (await
                // Set cookie
                cookies()).set('auth-token', '', {
                    httpOnly: true,
                    secure: !MyConfig.devMode, // false for localhost
                    sameSite: 'none',
                    maxAge: 0, // 1 day
                });
            (await
                // Set cookie
                cookies()).set('user-session', '', {
                    httpOnly: false,
                    secure: !MyConfig.devMode, // false for localhost
                    sameSite: 'none',
                    maxAge: 0, // 1 day
                });
            return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}