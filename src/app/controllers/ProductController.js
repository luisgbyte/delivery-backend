import * as Yup from 'yup';

import Product from '../models/Product';
import Category from '../models/Category';
import File from '../models/File';

class ProductController {
    async index(req, res) {
        const product = await Product.findAll({
            where: { stock: true },
            attributes: ['id', 'name', 'price', 'description', 'stock'],
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

        return res.json(product);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required().max(20),
            price: Yup.number().required().positive().integer(),
            description: Yup.string().required().max(20),
            stock: Yup.boolean(),
            category_id: Yup.number().required().positive().integer(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { name, category_id } = req.body;

        // checking if the category is valid
        const categoryExists = await Category.findByPk(category_id);

        if (!categoryExists) {
            return res.status(401).json({ error: 'Category is not valid' });
        }

        // checking if the product name already exists
        const productExists = await Product.findOne({
            where: { name },
        });

        if (productExists) {
            return res.status(401).json({ error: 'Product already exists' });
        }

        const { id, price, description, stock } = await Product.create(
            req.body
        );

        return res.json({
            id,
            name,
            price,
            description,
            stock,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required().max(20),
            price: Yup.number().required().positive().integer(),
            description: Yup.string().required().max(20),
            stock: Yup.boolean(),
            category_id: Yup.number().required().positive().integer(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { category_id } = req.body;

        // checking if the category is valid
        const categoryExists = await Category.findByPk(category_id);

        if (!categoryExists) {
            return res.status(401).json({ error: 'Category is not valid' });
        }

        // fetch product id from the database
        const product = await Product.findByPk(req.params.id);

        // check if product exists
        if (!product) {
            return res.status(401).json({ error: 'Product is not valid' });
        }

        // update product
        const { id, name, price, description, stock } = await product.update(
            req.body
        );

        return res.json({ id, name, price, description, stock });
    }

    async delete(req, res) {
        const product = await Product.findByPk(req.params.id);

        // checking if the product exists
        if (!product) {
            return res.status(401).json({ error: 'Product not found' });
        }

        await product.destroy();

        return res.status(200).json({});
    }
}

export default new ProductController();
