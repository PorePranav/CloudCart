import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

import prisma from '../utils/prisma';
import AppError from '../utils/AppError';
import axios from 'axios';
import { createProductSchema } from '../validators/productValidation';
import { Category } from '../types/prisma-client';

import 'shared-types';

export const verifyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token || token == null)
      return next(
        new AppError('You are not logged in. Please log in to get access', 401)
      );

    const authResponse = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/v1/auth/verifyUser?jwt=${token}`
    );

    if (authResponse.data.status === 'fail')
      return next(new AppError(authResponse.data.message, 401));

    req.user = authResponse.data.data;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );

    next();
  };
};

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await prisma.product.findMany();
    res.status(200).json({
      status: 'success',
      data: products,
    });
  }
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const zodResult = createProductSchema.safeParse(req.body);

    if (!zodResult.success) {
      const errors = zodResult.error.errors.map((err) => err.message);
      return next(new AppError(errors.join(', '), 400));
    }

    const { name, price, stock, description } = zodResult.data;
    const category: Category = zodResult.data.category as Category;

    if (Object.values(Category).indexOf(category) === -1)
      return next(new AppError('Invalid category', 400));

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        category,
        description,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newProduct,
    });
  }
);
