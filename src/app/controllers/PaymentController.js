import * as Yup from 'yup';

import Payment from '../models/Payment';

class PaymentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            type: Yup.string().required(),
            chance: Yup.number().positive().integer(),
            card_type: Yup.string(),
            card_banner: Yup.string()
                .min(6)
                .when('card_type', (card_type, field) =>
                    card_type ? field.required() : field
                ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const {
            id,
            type,
            chance,
            card_type,
            card_banner,
        } = await Payment.create(req.body);

        return res.json({
            id,
            type,
            chance,
            card_type,
            card_banner,
        });
    }
}

export default new PaymentController();
