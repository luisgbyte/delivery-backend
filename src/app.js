import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(
            helmet({
                directives: {
                    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                },
            })
        );

        this.server.use(
            cors({ origin: 'https://delivery-web-sg72e.ondigitalocean.app' })
        );
        this.server.use(express.json());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
