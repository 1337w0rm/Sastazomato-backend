export const logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const body = JSON.stringify(req.body);

    console.log(`[${method} ${url} - BODY: ${body}]`);
    next();
};

export const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    } else if (
        error.name === 'MongoServerError' &&
        error.message.includes('E11000 duplicate key error')
    ) {
        return response
            .status(400)
            .send({ error: 'Expected `username` to be unique' });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).send({ error: 'Token invalid' });
    } else {
        console.log(error);
        return response.status(500).send({ error: 'Internal Server Error' });
    }

    next();
};

export const checkAuthorized = (req, res, next) => {
    const user = req.session.user;
    if (!user) return res.status(401).send({ error: 'Not Authorized' });
    next();
};
