import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import AdminController from './app/controllers/AdminController';
import ClientController from './app/controllers/ClientController';
import AddressController from './app/controllers/AddressController';
import CategoryController from './app/controllers/CategoryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/clients', ClientController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.get('/clients', ClientController.index);
routes.put('/clients', ClientController.update);

routes.post('/admins', AdminController.store);
routes.put('/admins', AdminController.update);

routes.get('/addresses', AddressController.index);
routes.post('/addresses', AddressController.store);
routes.put('/addresses', AddressController.update);

routes.get('/categories', CategoryController.index);
routes.post('/categories', CategoryController.store);
routes.put('/categories', CategoryController.update);
routes.delete('/categories/:id', CategoryController.delete);

export default routes;
