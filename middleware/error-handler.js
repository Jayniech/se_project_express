module.exports = (err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send({ message: err.message || 'An error occurred on the server' });
};
