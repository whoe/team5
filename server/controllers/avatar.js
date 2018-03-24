const icon = require('../libs/indenticon/indenticon');
const typeInfos = {
    svg: { contentType: 'image/svg+xml', getImage: async id => icon.svg(id) },
    png: { contentType: 'image/png', getImage: async id => await icon.png(id) }
};

module.exports = async (req, res) => {
    let type = req.params.type || 'svg';
    let info = typeInfos[type];
    if (req.params.id) {
        res.set('Content-Type', info.contentType);
        res.send(await info.getImage(req.params.id));

        return;
    }

    if (!req.user) {
        res.sendStatus(401);

        return;
    }
    res.set('Content-Type', info.contentType);
    res.send(await info.getImage(req.user.id));
};
