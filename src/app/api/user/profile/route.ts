import { cookies } from "next/headers";
import { corsHeaders } from "../../../../../lib/utils/cors";
import { authVerifyUserToken } from "../../../../../lib/utils/auth-jwt";
import { connectToMongoDBS1 } from "../../../../../mongodb";
import { MyConfig } from "../../../../../lib/utils/config";

export async function OPTIONS(req: Request) {
    return new Response(null, {
        status: 204,
        headers: corsHeaders(req),
    });
}

export async function GET(
    req: Request,
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const tokenData = authVerifyUserToken(token ?? "N/A");

        if (tokenData?.user?.userRole !== "superadmin" || !tokenData?.user?.isActive) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const db = await connectToMongoDBS1();
        const data = await db.collection(MyConfig.colNameAdmin ?? "").findOne(
            { email: tokenData?.user?.email },
            { projection: { password: 0 } }
        );

        return new Response(JSON.stringify({ data }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders(req),
            },
        });
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
            return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders(req),
            },
        });
    }
}