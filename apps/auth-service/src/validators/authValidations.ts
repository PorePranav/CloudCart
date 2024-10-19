import z from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name should have at least 2 characters')
      .max(50, 'Name can have at most 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(50, 'Password can have at most 50 characters'),
    confirmPassword: z.string(),
    role: z.enum(['USER', 'ADMIN']).default('USER'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});
