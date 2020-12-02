export default async (req, res, next) => {
    if (!req.userAdmin) {
        return next();
    }
    return res.status(401).json({
        error: 'Administrators are not allowed to access the route',
    });
};
