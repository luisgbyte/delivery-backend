import * as Yup from 'yup';
import { addMinutes, isBefore } from 'date-fns';
import Order from '../models/Order';
import Product from '../models/Product';
import Payment from '../models/Payment';
import ProductOrder from '../models/ProductOrder';

const { Op } = require('sequelize');

class OrderController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const order = await Order.findAll({
            where: {
                client_id: req.userId,
                [Op.not]: [{ status: ['Entregue', 'Cancelado'] }],
            },
            attributes: ['id', 'total', 'date', 'status'],
            order: ['date'],
            limit: 10,
            offset: (page - 1) * 20,
            include: [
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
            products: Yup.array()
                .of(
                    Yup.object().shape({
                        product_id: Yup.number()
                            .positive()
                            .integer()
                            .required(),
                        amount: Yup.number().positive().integer().required(),
                    })
                )
                .required(),
            payments: Yup.object().shape({
                type: Yup.mixed().oneOf(['Cartão', 'Dinheiro']).required(),
                chance: Yup.number().positive().integer(),
                card_type: Yup.mixed().oneOf(['Débito', 'Credito']),
                card_banner: Yup.mixed().oneOf(['Visa', 'MasterCard']),
            }),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { payments, products } = req.body;

        // payments
        const payment = await Payment.create(payments);

        // order object
        const order = {};
        order.client_id = req.userId;
        order.payment_id = payment.id;

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

        order.total = total;

        const savedOrder = await Order.create(order);

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

        const dateWithAdd = addMinutes(order.date, 15);

        if (isBefore(dateWithAdd, new Date())) {
            return res.status(401).json({
                error: 'You can only cancel orders 15 minutes in advance',
            });
        }
        const { id, total, date, status } = await order.update({
            status: 'Cancelado',
        });

        return res.status(200).json({ id, total, date, status });
    }
}

export default new OrderController();
