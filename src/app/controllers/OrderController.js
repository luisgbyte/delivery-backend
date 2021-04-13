import * as Yup from 'yup';
import { addMinutes, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Order from '../models/Order';
import Client from '../models/Client';
import Product from '../models/Product';
import Payment from '../models/Payment';
import ProductOrder from '../models/ProductOrder';
import Notification from '../schemas/Notification';

const { Op } = require('sequelize');

class OrderController {
    async index(req, res) {
        // const { page = 1 } = req.query;

        const order = await Order.findAll({
            where: {
                client_id: req.userId,
                [Op.not]: {
                    [Op.and]: [
                        { status: ['Cancelado', 'Entregue'] },
                        {
                            updated_at: {
                                [Op.lt]: new Date(
                                    new Date().valueOf() - 5 * 60 * 1000
                                ),
                            },
                        },
                    ],
                },
            },
            attributes: ['id', 'total', 'status', 'created_at'],
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name'],
                    through: { attributes: ['quantity'] },
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
                        quantity: Yup.number().positive().integer().required(),
                    })
                )
                .required(),
            payments: Yup.object().shape({
                type: Yup.mixed()
                    .oneOf([
                        'cartão de crédito',
                        'cartão de débito',
                        'dinheiro',
                    ])
                    .required(),
                chance: Yup.number().positive().integer(),
            }),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'A validação falhou' });
        }

        const { payments, products } = req.body;

        // ordering product req order
        products.sort((a, b) => {
            if (a.product_id > b.product_id) {
                return 1;
            }
            if (a.product_id < b.product_id) {
                return -1;
            }
            return 0;
        });

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
        const products_db = await Product.findAll({
            where: { id: productsId },
        });

        if (products_db.length < products.length) {
            return res.status(400).json({ error: 'Produto não encontrado' });
        }

        // ordering products db
        products_db.sort((a, b) => {
            if (a.id > b.id) {
                return 1;
            }
            if (a.id < b.id) {
                return -1;
            }
            return 0;
        });

        // calculating the total order
        const total = products_db.reduce(
            (acc, product, index) =>
                acc + product.price * products[index].quantity,
            0
        );

        order.total = total;

        const {
            id,
            client_id,
            status,
            payment_id,
            created_at,
        } = await Order.create(order);

        // setting order_id for all objects in the order array
        products.map((obj) => {
            obj.order_id = id;
            return obj;
        });

        // creating several records in product_order
        await ProductOrder.bulkCreate(products, { returning: true });

        // Administrator order notification
        const client = await Client.findByPk(req.userId);
        const formattedDate = format(
            created_at,
            "'às' HH:mm'h' 'de' dd/MM/yyyy",
            {
                locale: pt,
            }
        );

        await Notification.create({
            content: `Novo pedido de ${client.name} ${formattedDate}`,
        });

        return res
            .status(200)
            .json({ id, total, status, client_id, payment_id });
    }

    async delete(req, res) {
        const order = await Order.findByPk(req.params.id);

        // checking if the order exists
        if (!order) {
            return res.status(401).json({ error: 'Pedido não encontrado' });
        }

        // checking if the order belongs to the user
        if (order.client_id !== req.userId) {
            return res
                .status(401)
                .json({ error: 'You are not allowed to perform this action' });
        }

        // checking if the order is canceled or delivered
        if (order.status === 'Cancelado' || order.status === 'Entregue') {
            return res.status(401).json({
                error: `O pedido não pode ser cancelado porque seu status foi 'cancelado' ou 'entregue'`,
            });
        }

        const dateWithAdd = addMinutes(order.created_at, 10);

        if (isBefore(dateWithAdd, new Date())) {
            return res.status(401).json({
                error:
                    'Você só pode cancelar pedidos 15 minutos após a realização do mesmo',
            });
        }
        const { id, total, status } = await order.update({
            status: 'Cancelado',
        });

        // Administrator order cancel notification
        const client = await Client.findByPk(req.userId);
        const formattedDate = format(
            new Date(),
            "'às' HH:mm'h' 'de' dd/MM/yyyy",
            {
                locale: pt,
            }
        );

        await Notification.create({
            content: `Novo cancelamento de ${client.name} ${formattedDate}`,
        });

        return res.status(200).json({ id, total, status });
    }
}

export default new OrderController();
