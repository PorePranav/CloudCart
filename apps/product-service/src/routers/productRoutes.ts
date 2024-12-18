import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  restrictTo,
  updateProduct,
  verifyUser,
} from '../controllers/productController';

const router = Router();

router.get('/', getAllProducts);

router.use(verifyUser, restrictTo('ADMIN'));
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/', createProduct);

export default router;
