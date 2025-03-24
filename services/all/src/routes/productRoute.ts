import { Hono } from 'hono';
import { getProducts, getProduct, createProduct, editProduct, deleteProduct } from '../controllers/productController.js';

// revoçir l'import de middleware requirefield


const productRoute = new Hono();

productRoute.get('/', getProducts);
productRoute.get('/:id', getProduct);
productRoute.post('/', createProduct);
// productRoute.put('/:id', editProduct, requiredFields(["name", "price"]));
productRoute.put('/:id', editProduct);
productRoute.delete('/:id', deleteProduct);

export default productRoute;