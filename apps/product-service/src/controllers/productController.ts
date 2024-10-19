import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

import prisma from '../utils/prisma';

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await prisma.product.findMany();
    res.status(200).json({
      status: 'success',
      data: products,
    });
  }
);
