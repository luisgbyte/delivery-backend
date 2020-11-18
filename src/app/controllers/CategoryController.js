import * as Yup from 'yup';

import Category from '../models/Category';

class CategoryController {
    async index(req, res) {
        const address = await Category.findAll({
            attributes: ['id', 'name'],
        });

        return res.json(address);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        // checking if the category name already exists
        const categoryExists = await Category.findOne({
            where: { name: req.body.name },
        });

        if (categoryExists) {
            return res.status(401).json({ error: 'Category already exists' });
        }

        const { id, name } = await Category.create(req.body);

        return res.json({
            id,
            name,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id, name } = req.body;

        // checking if the category exists
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(401).json({ error: 'Category not found' });
        }

        // checking if the category name already exists
        const categoryExists = await Category.findOne({
            where: { name },
        });

        if (categoryExists) {
            return res.status(401).json({ error: 'Category already exists' });
        }

        await category.update(req.body);

        return res.json({ id, name });
    }

    async delete(req, res) {
        const category = await Category.findByPk(req.params.id);

        // checking if the category exists
        if (!category) {
            return res.status(401).json({ error: 'Category not found' });
        }

        // checking if the user is an administrator
        if (!req.userAdmin) {
            return res.status(401).json({
                error: 'You are not allowed to perform this action',
            });
        }

        await category.destroy();

        return res.status(200).json({});
    }
}

export default new CategoryController();
