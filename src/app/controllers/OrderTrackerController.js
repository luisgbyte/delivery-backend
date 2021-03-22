// import * as Yup from 'yup';
import Order from '../models/Order';
import Product from '../models/Product';
import Payment from '../models/Payment';
import Client from '../models/Client';
import File from '../models/File';
import Address from '../models/Address';

const { Op } = require('sequelize');

class OrderTrackerController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const order = await Order.findAndCountAll({
            distinct: true,
            where: {
                [Op.not]: [{ status: ['Entregue', 'Cancelado'] }],
            },
            attributes: ['id', 'total', 'created_at', 'status'],
            order: [['created_at', 'DESC']],
            limit: 3,
            offset: (page - 1) * 3,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Address,
                            as: 'address',
                            attributes: [
                                'city',
                                'neighborhood',
                                'street',
                                'number',
                                // 'cep',
                            ],
                        },
                    ],
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price'],
                    through: { attributes: ['quantity'] },
                    include: [
                        {
                            model: File,
                            as: 'file',
                            attributes: ['id', 'url', 'path'],
                        },
                    ],
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: [
                        'id',
                        'type',
                        'chance',
                        'card_type',
                        'card_banner',
                    ],
                },
            ],
        });

        return res.json(order);
    }
}

export default new OrderTrackerController();
