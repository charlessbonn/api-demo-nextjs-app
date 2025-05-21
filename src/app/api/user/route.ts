import { connectToMongoDBS1 } from "../../../../mongodb";
import { MyConfig } from "../../../../lib/utils/config";
import { registerUserSchema, USERDATAMODEL } from "../../../../lib/interfaces/user";
import { authHashSync } from "../../../../lib/utils/bcrypt";
import { cookies } from "next/headers";
import { authVerifyUserToken } from "../../../../lib/utils/auth-jwt";
import { corsHeaders } from "../../../../lib/utils/cors";

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
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const tokenData = authVerifyUserToken(token ?? "N/A");

        if (tokenData?.user?.userRole !== "superadmin" || !tokenData?.user?.isActive) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const db = await connectToMongoDBS1();
        const data = await db.collection(MyConfig.colNameAdmin ?? "").find(
            {},
            { projection: { password: 0 } }
        ).toArray();

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
            (await
                // Set cookie
                cookies()).set('user-session', '', {
                    httpOnly: false,
                    secure: !MyConfig.devMode, // false for localhost
                    sameSite: 'none',
                    maxAge: 0, // 1 day
                });
            return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders(req),},
        });
    }
}

export async function POST(
    req: Request,
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const tokenData = authVerifyUserToken(token ?? "N/A");

        if (tokenData?.user?.userRole !== "superadmin" || !tokenData?.user?.isActive) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const body = await req.json();
        const newUser = body as USERDATAMODEL | undefined;
        const result = registerUserSchema.safeParse(body);

        if (!newUser) {
            return new Response(JSON.stringify({ error: "Invalid user data" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        if (!result.success) {
            return new Response(JSON.stringify({
                error: "Invalid user data",
                errors: result.error.flatten().fieldErrors
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const newPassword = await authHashSync(newUser.password ?? "");
        newUser.password = newPassword;

        // User default data override
        newUser.userStatus = "pending";
        newUser.isActive = false;
        newUser.created_at = (new Date()).toISOString();

        const db = await connectToMongoDBS1();
        await db.collection(MyConfig.colNameAdmin ?? "N/A").createIndex({ email: 1 }, { unique: true });
        await db.collection(MyConfig.colNameAdmin ?? "").insertOne(newUser);
        // const result: InsertOneResult<Document> = await db.collection(MyConfig.colNameAdmin ?? "").insertOne(newUser);
        // const data = `New item created: ${result.insertedId}`;

        return new Response(null, {
            status: 204,
            headers: corsHeaders(req),
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
            (await
                // Set cookie
                cookies()).set('user-session', '', {
                    httpOnly: false,
                    secure: !MyConfig.devMode, // false for localhost
                    sameSite: 'none',
                    maxAge: 0, // 1 day
                });
            return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
                status: 401,
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