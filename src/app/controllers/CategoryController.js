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
            return res.status(400).json({ error: 'A validação falhou' });
        }

        // checking if the category name already exists
        const categoryExists = await Category.findOne({
            where: { name: req.body.name },
        });

        if (categoryExists) {
            return res.status(401).json({ error: 'Categoria já existe' });
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
            return res.status(400).json({ error: 'A validação falhou' });
        }

        const { name } = req.body;
        let { id } = req.params;

        id = Number(id);

        // checking if the category exists
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(401).json({ error: 'Categoria não encontrada' });
        }

        // checking if the category name already exists
        const categoryExists = await Category.findOne({
            where: { name },
        });

        if (categoryExists && categoryExists.id !== id) {
            return res.status(401).json({ error: 'Categoria já existe' });
        }

        await category.update(req.body);

        return res.json({ id, name });
    }

    async delete(req, res) {
        const category = await Category.findByPk(req.params.id);

        // checking if the category exists
        if (!category) {
            return res.status(401).json({ error: 'Categoria não encontrada' });
        }

        const { id, name } = category;

        await category.destroy();

        return res.status(200).json({ id, name });
    }
}

export default new CategoryController();
