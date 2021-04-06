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

        const { status } = req.body;

        // no cancellation action on orders delivered or already canceled
        if (
            status === 'Cancelado' &&
            (order.status === 'Entregue' || order.status === 'Cancelado')
        ) {
            return res.status(401).json({
                error:
                    'The order cannot be canceled because its status is canceled or delivered',
            });
        }

        const { id, total, created_at, client_id } = await order.update({
            status,
        });

        return res.json({
            id,
            total,
            created_at,
            client_id,
            status,
        });
    }
}

export default new OrderStatusController();
