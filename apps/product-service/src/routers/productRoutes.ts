import { Router } from 'express';

import {
  createProduct,
  getAllProducts,
  restrictTo,
  verifyUser,
} from '../controllers/productController';

const router = Router();

router.get('/', getAllProducts);

router.use(verifyUser);
router.post('/', restrictTo('ADMIN'), createProduct);

export default router;
