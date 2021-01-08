import * as Yup from 'yup';

import Product from '../models/Product';
import Category from '../models/Category';
import File from '../models/File';

class ProductController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const product = await Product.findAll({
            where: { stocked: true },
            attributes: ['id', 'name', 'price', 'description', 'stocked'],
            order: ['name'],
            limit: 10,
            offset: (page - 1) * 20,
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
            stocked: Yup.boolean(),
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
            price: Yup.number().positive().integer(),
            description: Yup.string().max(20),
            stocked: Yup.boolean(),
            category_id: Yup.number().positive().integer(),
            file_id: Yup.number().positive().integer(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { category_id, file_id } = req.body;

        // fetch product id from the database
        const product = await Product.findByPk(req.params.id);

        // check if product exists
        if (!product) {
            return res.status(401).json({ error: 'Product is not valid' });
        }

        // checking if the category is valid
        if (category_id) {
            const categoryExists = await Category.findByPk(category_id);

            if (!categoryExists) {
                return res.status(401).json({ error: 'Category is not valid' });
            }
        }

        // checking if the file/image is valid
        if (file_id) {
            const fileExists = await File.findByPk(file_id);

            if (!fileExists) {
                return res.status(401).json({ error: 'Image is not valid' });
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
            return res.status(401).json({ error: 'Product not found' });
        }

        await product.destroy();

        return res.status(200).json({});
    }
}

export default new ProductController();
