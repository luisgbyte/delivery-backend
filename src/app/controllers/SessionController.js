import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';

import Client from '../models/Client';
import Administrator from '../models/Admin';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email, password } = req.body;

        const client = await Client.findOne({ where: { email } });

        const administrator = await Administrator.findOne({ where: { email } });

        if (!client && !administrator) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (
            !((await client) ? client : administrator.checkPassword(password))
        ) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name } = client || administrator;

        // add to the token payload if the user is an administrator
        const admin = !!administrator;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id, admin }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
