import { Router } from 'express';
import multer from 'multer';
import multerconfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import AdminController from './app/controllers/AdminController';
import ClientController from './app/controllers/ClientController';
import AddressController from './app/controllers/AddressController';
import CategoryController from './app/controllers/CategoryController';
import FileController from './app/controllers/FileController';
import ProductController from './app/controllers/ProductController';
import OrderController from './app/controllers/OrderController';
import PaymentController from './app/controllers/PaymentController';
import TrackerOrderController from './app/controllers/TrackerOrderController';
import ProductStockController from './app/controllers/ProductStockController';
import OrderStatusController from './app/controllers/OrderStatusController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();
const upload = multer(multerconfig);

routes.post('/clients', ClientController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.get('/clients', ClientController.index);
routes.put('/clients', ClientController.update);

routes.get('/tracker', TrackerOrderController.index);

routes.post('/payments', PaymentController.store);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/addresses', AddressController.index);
routes.post('/addresses', AddressController.store);
routes.put('/addresses', AddressController.update);

routes.use(adminMiddleware);
routes.post('/admins', AdminController.store);
routes.put('/admins', AdminController.update);

routes.post('/files', upload.single('file'), FileController.store);
routes.put('/files/:id', upload.single('file'), FileController.update);

routes.get('/categories', CategoryController.index);
routes.post('/categories', CategoryController.store);
routes.put('/categories/:id', CategoryController.update);
routes.delete('/categories/:id', CategoryController.delete);

routes.get('/products', ProductController.index);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);

routes.put('/products/:id/stock', ProductStockController.update);

routes.put('/orders/:id/status', OrderStatusController.update);

export default routes;
