import * as Yup from 'yup';
import Order from '../models/Order';

class OrderStatusController {
    async update(req, res) {
        const schema = Yup.object().shape({
            status: Yup.mixed()
                .oneOf(['Confirmado', 'Cancelado', 'Pronto', 'Entregue'])
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(401).json({ error: 'Order does not exist' });
        }

        const { id, total, date, client_id, status } = await order.update(
            req.body
        );

        return res.json({
            id,
            total,
            date,
            client_id,
            status,
        });
    }
}

export default new OrderStatusController();
