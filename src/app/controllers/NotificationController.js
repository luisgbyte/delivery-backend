import Notification from '../schemas/Notification';

class NotificationController {
    async index(req, res) {
        const notifications = await Notification.find()
            .sort({ createdAt: 'desc' })
            .limit(20);

        return res.json(notifications);
    }

    async update(req, res) {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        return res.status(200).json(notification);
    }
}

export default new NotificationController();
