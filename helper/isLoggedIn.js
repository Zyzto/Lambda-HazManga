module.exports = (request, response, next) => {
    if (!request.user) {
        response.redirect("/auth/login");
    } else {
        next();
    }
};