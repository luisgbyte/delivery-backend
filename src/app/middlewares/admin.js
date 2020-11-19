export default async (req, res, next) => {
    if (req.userAdmin) {
        return next();
    }
    return res
        .status(401)
        .json({ error: 'You do not have the ability to perform this action' });
};
