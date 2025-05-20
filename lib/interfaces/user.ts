import { JwtPayload } from "jsonwebtoken";
import z from "zod";

export interface USERDATAMODEL {
    key?: string;
    id?: string;
    db?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    userStatus?: string;
    userRole?: string;
    isActive?: boolean;
    image?: string;
    login_at?: string;
    logout_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface JWTUSERDATAMODEL extends JwtPayload {
    // Add properties that are specific to the custom user model
    user?: USERDATAMODEL
}

export const registerUserSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .refine((val) => !/\s/.test(val), {
            message: "Password must not contain whitespace",
        }),
});