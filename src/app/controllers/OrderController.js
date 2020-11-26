import * as Yup from 'yup';
// import Sequelize from 'sequelize';
import Order from '../models/Order';
import Client from '../models/Client';
import Product from '../models/Product';
import Payment from '../models/Payment';
import ProductOrder from '../models/ProductOrder';
// import database from '../../config/database';

const { Op } = require('sequelize');

// const t = new Sequelize(database);

class OrderController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const order = await Order.findAll({
            where: {
                [Op.not]: [{ status: ['Entregue', 'Cancelado'] }],
            },
            attributes: ['id', 'total', 'date', 'status'],
            order: ['date'],
            limit: 10,
            offset: (page - 1) * 20,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name'],
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: ['id', 'type'],
                },
            ],
        });

        return res.json(order);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            products: Yup.array().required(),
            payment_id: Yup.number().required().positive().integer(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { products, ...data } = req.body;

        data.client_id = req.userId;

        // creating array with product id
        const productsId = products.map((product) => {
            return product.product_id;
        });

        // seeking all products
        const result = await Product.findAll({
            where: { id: productsId },
        });

        if (result.length < products.length) {
            return res.status(400).json({ error: 'Products not found' });
        }

        // calculating the total order
        const total = result.reduce(
            (acc, product, index) =>
                acc + product.price * products[index].amount,
            0
        );

        data.total = total;

        const savedOrder = await Order.create(data);

        // setting order_id for all objects in the order array
        products.map((obj) => {
            obj.order_id = savedOrder.id;
            return obj;
        });

        // creating several records in product_order
        await ProductOrder.bulkCreate(products, { returning: true });

        return res.status(200).json(savedOrder);
    }

    async delete(req, res) {
        const order = await Order.findByPk(req.params.id);

        // checking if the order exists
        if (!order) {
            return res.status(401).json({ error: 'Order not found' });
        }

        // checking if the order belongs to the user
        if (order.client_id !== req.userId) {
            return res
                .status(401)
                .json({ error: 'You are not allowed to perform this action' });
        }

        const { id, total, date, status } = await order.update({
            status: 'Cancelado',
        });

        return res.status(200).json({ id, total, date, status });
    }
}

export default new OrderController();
