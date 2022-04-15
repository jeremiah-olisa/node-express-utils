import express from "express";
import helmet, { HelmetOptions } from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from "hpp";
import cookieParser from 'cookie-parser'

const xss = require('xss-clean');

type _middlewareType = {
    env?: string;
    helmetOptions?: Readonly<HelmetOptions>;
    expressJsonReqLimit?: string | number;
    mongoSanitizeOptions?: mongoSanitize.Options;
    publicDir?: string;
    hppOptions?: hpp.Options;
}

// Serving static files

function _middleware({ env = 'development', helmetOptions, expressJsonReqLimit = '10kb', mongoSanitizeOptions, publicDir = 'public', hppOptions }: _middlewareType = {}) {
    const middleware = express();
    // middleware.use(express.json({ limit: '10kb' }));
    middleware.use(cookieParser());

    middleware.use(helmet(helmetOptions));

    // Development logging
    if (env === 'development') {
        middleware.use(morgan('dev'));
    }

    // Body parser, reading data from body into req.body
    middleware.use(express.json({ limit: expressJsonReqLimit }));

    // Data sanitization against NoSQL query injection
    middleware.use(mongoSanitize(mongoSanitizeOptions));

    // Data sanitization against XSS
    middleware.use(xss());

    // Prevent parameter pollution
    middleware.use(hpp(hppOptions));

    middleware.use(express.static(`${__dirname}/${publicDir}`));

    return middleware;
}

export default _middleware;