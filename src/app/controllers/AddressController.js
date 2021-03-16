import * as Yup from 'yup';

import Address from '../models/Address';

class AddressController {
    async index(req, res) {
        const address = await Address.findOne({
            where: { client_id: req.userId },
            attributes: [
                'id',
                'city',
                'neighborhood',
                'street',
                'number',
                'client_id',
            ],
        });

        return res.json(address);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            city: Yup.string().required(),
            neighborhood: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const userAddressExists = await Address.findOne({
            where: { client_id: req.userId },
        });

        if (userAddressExists) {
            return res
                .status(401)
                .json({ error: 'Customer already has address' });
        }

        // defining 'client_id' with 'user_id' of the user session
        req.body.client_id = req.userId;

        const { id, city, neighborhood, street, number } = await Address.create(
            req.body
        );

        return res.json({
            id,
            city,
            neighborhood,
            street,
            number,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            city: Yup.string().required(),
            neighborhood: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const address = await Address.findOne({
            where: { client_id: req.userId },
        });

        // defining 'client_id' with 'user_id' of the user session
        req.body.client_id = req.userId;

        const { id, city, neighborhood, street, number } = await address.update(
            req.body
        );

        return res.json({ id, city, neighborhood, street, number });
    }
}

export default new AddressController();
