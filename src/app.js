import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';

import './database';

const whitelist = [
    'http://localhost:3000',
    'https://app.netlify.com/sites/nervous-kowalevski-6308c2/overview',
];

const corsOptions = {
    origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(
            helmet.contentSecurityPolicy({
                directives: {
                    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                },
            })
        );
        this.server.use(cors(corsOptions));
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
