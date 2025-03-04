import * as Yup from 'yup';
import Client from '../models/Client';

class ClientController {
    async index(req, res) {
        const clients = await Client.findAll({
            attributes: ['id', 'name', 'email'],
        });

        return res.json(clients);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'A validação falhou' });
        }

        const userExists = await Client.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const { id, name, email } = await Client.create(req.body);

        return res.json({
            id,
            name,
            email,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'A validação falhou' });
        }

        const { email, oldPassword } = req.body;

        const user = await Client.findByPk(req.userId);

        if (email !== user.email) {
            const userExists = await Client.findOne({
                where: { email },
            });

            if (userExists) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name, provider } = await user.update(req.body);

        return res.json({ id, name, email, provider });
    }
}

export default new ClientController();
