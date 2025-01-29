import { z } from "zod"

export const UserLoginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const UserRegisterSchema = UserLoginSchema.extend({
    fullName: z.string().min(1, "Name is required"),
});
