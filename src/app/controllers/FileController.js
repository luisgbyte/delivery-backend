import File from '../models/File';

class FileController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file;

        const file = await File.create({
            name,
            path,
        });

        return res.json(file);
    }

    async update(req, res) {
        const file = await File.findByPk(req.params.id);

        // checking if the file exists
        if (!file) {
            return res.status(401).json({ error: 'File not found' });
        }

        const { originalname: name, filename: path } = req.file;

        await file.update({ name, path });

        return res.status(200).json({});
    }
}

export default new FileController();
