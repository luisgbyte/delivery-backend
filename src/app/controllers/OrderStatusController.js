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
            return res.status(400).json({ error: 'A validação falhou' });
        }

        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(401).json({ error: 'O pedido não existe' });
        }

        const { status } = req.body;

        // no cancellation action on orders delivered or already canceled
        if (
            status === 'Cancelado' &&
            (order.status === 'Entregue' || order.status === 'Cancelado')
        ) {
            return res.status(401).json({
                error: `O pedido não pode ser cancelado porque seu status já é 'cancelado' ou 'entregue'`,
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
