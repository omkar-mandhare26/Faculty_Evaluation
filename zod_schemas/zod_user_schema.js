import zod from "zod";

const userZodSchema = zod.object({
    userId: zod.string().length(5),
    password: zod
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
    firstName: zod.string(),
    lastName: zod.string(),
    contactNo: zod.string().length(10, "Contact number must be exactly 10 digits").regex(/^\d+$/, "Contact number must contain only digits"),
    emailId: zod.string().email("Invalid email address"),
    qualification: zod.string()
});

export default userZodSchema;
