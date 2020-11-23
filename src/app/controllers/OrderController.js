import * as Yup from 'yup';
import Order from '../models/Order';
import Client from '../models/Client';
import Product from '../models/Product';
import Payment from '../models/Payment';

const { Op } = require('sequelize');

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

        // data.payment_id = id;
        const order = await Order.create(data);

        if (products && products.length > 0) {
            await order.setProduct(products);
        }

        const { id, total, date, client_id, status } = order;

        return res.json({
            id,
            total,
            date,
            client_id,
            status,
        });
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
