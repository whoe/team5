const md5 = require('js-md5');
const { lightnessThreshold, darknessThreshold, svgConfig } = require('./config');
const svg2png = require('convert-svg-to-png');

/**
 * --------
 * Methods:
 * --------
 *    .svg()
 *    .png() - async
 *    .middleware()
 * ------
 * Usage:
 * ------
 *      const indentIcon = require('./libs/indenticon/indenticon');
 *
 *      res.send(indentIcon.svg(req.user.id));
 *
 *      server.use(indentIcon.middleware());
 *
 *      server.use(indentIcon.middleware('svgString', req => {
 *          if (!req.data) req.data = {};
 *              return req.data;
 *      }); // req.data.svgString === '<svg...
 *
 *
 */
class IndentIcon {

    /**
     * @param {Array} digest js-md5.digest(..)
     * @returns {Object} {red, green, blue}
     * Может быть слишком светлым или слишком темным
     */
    static _getDirtyColor(digest) {
        if (digest.length !== 16) {
            throw new Error('Argument must be Array existing 16 byte values');
        }
        let accumulate = (color, byte) => (color + byte) % 256;
        let part = (array, start, end) => array.slice(start, end).reduce(accumulate, digest[15]);

        return {
            red: part(digest, 0, 5),
            green: part(digest, 5, 10),
            blue: part(digest, 10, 15)
        };
    }

    static _checkColor(color) {
        if (!color || !color.red || !color.green || !color.blue) {
            throw new TypeError('Bad color object');
        }
    }

    /**
     * Слишком светлые цвета утемняет
     * @param {Object} color
     * @returns {Object} color
     */
    static _clearColor(color) {
        this._checkColor(color);

        const partDiff = diff => Math.floor(diff / 3) + 1;
        const applyPartDiff = (c, pd) => ({
            red: c.red + pd,
            green: c.green + pd,
            blue: c.blue + pd
        });

        const sum = color.red + color.green + color.blue;

        if (sum > lightnessThreshold) {
            return applyPartDiff(color, partDiff(lightnessThreshold - sum));
        }

        if (sum < darknessThreshold) {
            return applyPartDiff(color, partDiff(darknessThreshold - sum));
        }

        return color;
    }

    static _cssColor(color) {
        let hex = byte => {
            let res = byte.toString(16);

            return res.length < 2 ? `0${res}` : res;
        };

        return `#${hex(color.red)}${hex(color.green)}${hex(color.blue)}`;
    }

    /**
     * By default for 11x11 svg generating
     * @param {Array} digest
     * @returns {Array} [{fill, x, y},...]
     */
    static _getCells(digest) {
        if (digest.length !== 16) {
            throw new TypeError('Digest length must be a length of 16 (md5)');
        }
        const leftCenter = digest.slice(0, 15)
            .map(byte => Boolean(byte % 2));
        const all = leftCenter.concat(
            leftCenter.slice(5, 10),
            leftCenter.slice(0, 5)
        );

        return all.map((fill, index) => ({
            fill,
            x: Math.floor(index / 5) * svgConfig.squareFace + svgConfig.margin,
            y: (index % 5) * svgConfig.squareFace + svgConfig.margin
        }));
    }

    static svg(userId, size = 100) {
        const digest = md5.digest(userId.toString());
        const dirtyColor = this._getDirtyColor(digest);
        const color = this._clearColor(dirtyColor);
        const sizeBox = svgConfig.squareFace * 5 + svgConfig.margin * 2;

        let svg = `<svg version="${svgConfig.version}" baseProfile="${svgConfig.baseProfile}"\
            width="${size}" height="${size}"\
            viewBox="0 0 ${sizeBox} ${sizeBox}"
            xmlns="http://www.w3.org/2000/svg">`;

        const fill = `fill="${this._cssColor(color)}"`;
        const cells = this._getCells(digest);

        cells.forEach(cell => {
            if (cell.fill) {
                svg += `<rect x="${cell.x}" y="${cell.y}"\
                    width="${svgConfig.squareFace}"\
                    height="${svgConfig.squareFace}"\
                    ${fill} />`;
            }
        });
        svg += '</svg>';

        return svg;
    }

    /**
     * Добавляет svg в request
     *
     * по умолчанию:
     *
     *      req.user.icon = svg;
     *
     * @param {String} key Ключ по которому помещается svg
     * @param {Func} where функция возвращающая контейнер, в который помещается svg
     * @returns {Func}
     */
    static middleware(key = 'icon', where = (req => req.user)) {
        return function (req, res, next) {
            if (!req.user) {
                next();

                return;
            }
            let container = where(req);
            if (!container) {
                throw new Error('Bad where function');
            }
            const svg = IndentIcon.svg(req.user.id);
            container[key] = svg;
            next();
        };
    }

    static async png(userId, size = 100) {
        const svg = this.svg(userId, size);

        return await svg2png.convert(svg);
    }
}

module.exports = IndentIcon;

