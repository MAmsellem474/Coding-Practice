function notFoundHandler(req, res, next) {
    const err = new Error(`${req.originalUrl} not found.`);
    err.status = 404;
    next(err);
}

function finalErrorHandler(err, req, res, next) {
    const status = err.status || 500;
    console.log(err);
    let message = err.message;
    if (status === 500) {
        message = "Internal Server Error (Check Server Logs)";
    }
    res.status(status).json({
        error: true,
        message: message,
        status: status
        
    });
}

export { notFoundHandler, finalErrorHandler };