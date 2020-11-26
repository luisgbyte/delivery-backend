import Product from '../models/Product';

class ProductStockController {
    async update(req, res) {
        // checking if the product exists
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(401).json({ error: 'Product does not exist' });
        }

        const stocked = !product.stocked;

        const { id, name } = await product.update({ stocked });

        return res.json({
            id,
            name,
            stocked,
        });
    }
}

export default new ProductStockController();
