module.exports = (server, app) => {
    const render = pageName => (req, res) => app.render(req, res, `/${pageName}`);

    server
        .route('/')
        .get(render('index'));

    server.all('*', (req, res) => res.sendStatus(404));
};
