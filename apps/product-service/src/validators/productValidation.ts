import z from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name should have at least 2 characters')
    .max(50, 'Name can have at most 50 characters'),
  price: z.number().min(1, 'Price should be at least 1'),
  stock: z.number().min(1, 'Stock should be at least 1'),
  category: z.string().min(2, 'Category should have at least 2 characters'),
  description: z
    .string()
    .max(500, 'Description can have at most 500 characters'),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name should have at least 2 characters')
    .max(50, 'Name can have at most 50 characters'),
  price: z.number().min(1, 'Price should be at least 1'),
  stock: z.number().min(1, 'Stock should be at least 1'),
  category: z.string().min(2, 'Category should have at least 2 characters'),
  description: z
    .string()
    .max(500, 'Description can have at most 500 characters'),
});
