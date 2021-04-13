import * as Yup from 'yup';

import Product from '../models/Product';
import Category from '../models/Category';
import File from '../models/File';
import Order from '../models/Order';
// import ProductOrder from '../models/ProductOrder';

const { Op } = require('sequelize');

class ProductController {
    async index(req, res) {
        const { page = null } = req.query;

        let product = '';
        // test aq
        if (page !== null) {
            product = await Product.findAndCountAll({
                attributes: ['id', 'name', 'price', 'description', 'stocked'],
                order: ['name'],
                limit: 6,
                offset: (page - 1) * 6,
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: File,
                        as: 'file',
                        attributes: ['id', 'path', 'url'],
                    },
                ],
            });
        } else {
            product = await Product.findAll({
                where: {
                    stocked: {
                        [Op.eq]: true,
                    },
                },
                attributes: ['id', 'name', 'price', 'description', 'stocked'],
                order: ['name'],
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: File,
                        as: 'file',
                        attributes: ['id', 'path', 'url'],
                    },
                ],
            });
        }

        return res.json(product);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required().max(20),
            price: Yup.number().required().positive(),
            description: Yup.string().required().max(20),
            stocked: Yup.boolean(),
            category_id: Yup.number().required().positive().integer(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'A validação falhou' });
        }

        const { name, category_id } = req.body;

        // checking if the category is valid
        const categoryExists = await Category.findByPk(category_id);

        if (!categoryExists) {
            return res.status(401).json({ error: 'Categoria não é válida' });
        }

        // checking if the product name already exists
        const productExists = await Product.findOne({
            where: { name },
        });

        if (productExists) {
            return res.status(401).json({ error: 'Produto já existe' });
        }

        const { id } = await Product.create(req.body);

        // return interesting fields for the frontend
        const fieldsProduct = await Product.findOne({
            where: { id },
            attributes: ['id', 'name', 'price', 'description', 'stocked'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
                {
                    model: File,
                    as: 'file',
                    attributes: ['id', 'path', 'url'],
                },
            ],
        });

        return res.json(fieldsProduct);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().max(20),
            price: Yup.number().positive(),
            description: Yup.string().max(20),
            stocked: Yup.boolean(),
            category_id: Yup.number().positive().integer(),
            file_id: Yup.number().positive().integer(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'A validação falhou' });
        }

        const { category_id, file_id } = req.body;

        // fetch product id from the database
        const product = await Product.findByPk(req.params.id);

        // check if product exists
        if (!product) {
            return res.status(401).json({ error: 'Produto não é válido' });
        }

        // checking if the category is valid
        if (category_id) {
            const categoryExists = await Category.findByPk(category_id);

            if (!categoryExists) {
                return res
                    .status(401)
                    .json({ error: 'Categoria não é válida' });
            }
        }

        // checking if the file/image is valid
        if (file_id) {
            const fileExists = await File.findByPk(file_id);

            if (!fileExists) {
                return res.status(401).json({ error: 'Imagem não é válida' });
            }
        }

        // update product
        const { id } = await product.update(req.body);

        // return interesting fields for the frontend
        const fieldsProduct = await Product.findOne({
            where: { id },
            attributes: ['id', 'name', 'price', 'description', 'stocked'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
                {
                    model: File,
                    as: 'file',
                    attributes: ['id', 'path', 'url'],
                },
            ],
        });

        return res.json(fieldsProduct);
    }

    async delete(req, res) {
        const product = await Product.findByPk(req.params.id);

        // checking if the product exists
        if (!product) {
            return res.status(401).json({ error: 'Produto não encontrado' });
        }

        // validation: check if there is a product order in which the status is different from: 'delivered' or 'canceled'
        const orderExists = await Product.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id', 'name'],
            include: {
                model: Order,
                as: 'order',
                where: { status: ['Realizado', 'Confirmado', 'Pronto'] },
                attributes: ['id', 'status'],
                through: {
                    attributes: [],
                },
            },
        });

        if (orderExists && orderExists.order.length > 0) {
            return res.status(401).json({
                error:
                    'O produto não pode ser excluído, pois ainda existem pedidos para ser atendidos',
            });
        }

        await product.destroy();

        return res.status(200).json({});
    }
}

export default new ProductController();
