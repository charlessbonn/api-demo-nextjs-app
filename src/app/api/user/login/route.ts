import { cookies } from "next/headers";
import { registerUserSchema, USERDATAMODEL } from "../../../../../lib/interfaces/user";
import { authGenerateTempUserToken } from "../../../../../lib/utils/auth-jwt";
import { authCompareSync } from "../../../../../lib/utils/bcrypt";
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
    req: Request,
) {
    try {
        const body = await req.json();
        const { email, password } = body;
        const result = registerUserSchema.safeParse(body);

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Invalid login" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        if (!result.success) {
            return new Response(JSON.stringify({
                error: "Invalid login",
                errors: result.error.flatten().fieldErrors
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }

        const db = await connectToMongoDBS1();
        // const user = await db.collection(MyConfig.colNameAdmin ?? "N/A").findOne({email: email ?? "N/A"});
        const user = await db.collection(MyConfig.colNameAdmin ?? "N/A").findOneAndUpdate(
            { email: email ?? "N/A" },         // Filter (what to find)
            { $set: { login_at: (new Date()).toISOString() } }, // Update operation
            { returnDocument: 'after' }    // Options
        );

        if (user) {
            const isPasswordValid = await authCompareSync(password, user.password);
            const newUser = user as USERDATAMODEL;
            if (newUser.userStatus !== "approved" || !newUser.isActive) {
                return new Response(JSON.stringify({ error: "User not yet active" }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders(req),
                    },
                });
            } else if (isPasswordValid) {
                const newUser: USERDATAMODEL = {
                    key: 'auth',
                    id: user._id.toString(),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    userRole: user.userRole,
                    isActive: user.isActive
                }

                const token = authGenerateTempUserToken(newUser);

                // Set cookie
                (await
                    // Set cookie
                    cookies()).set('auth-token', `Bearer ${token}`, {
                        httpOnly: true,
                        secure: MyConfig.devMode, // false for localhost
                        sameSite: 'none',
                        maxAge: 60 * 60 * 24, // 1 day
                    });

                return new Response(null, { status: 204 });
            } else {
                return new Response(JSON.stringify({ error: "Invalid login" }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders(req),
                    },
                });
            }
        } else {
            return new Response(JSON.stringify({ error: "Something went wrong. Cannot find user." }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(req),
                },
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: `Something went wrong. ERR: ${error}` }), {
            status: 400,
            headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders(req),
            },
        });
    }
}