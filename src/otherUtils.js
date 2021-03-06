const Fs = require("fs");

/**
 * Format duration in french
 * @param {Number} time 
 * @returns {String} 
 */
const formatDuration = (time) => {

    const units = [
        {
            timeInSeconds: 365 * 24 * 60 * 60,
            singularName: "an",
            plurialName: "ans"
        },
        {
            timeInSeconds: 30 * 24 * 60 * 60,
            singularName: "mois",
            plurialName: "mois"
        },
        {
            timeInSeconds: 24 * 60 * 60,
            singularName: "jour",
            plurialName: "jours"
        },
        {
            timeInSeconds: 60 * 60,
            singularName: "heure",
            plurialName: "heures"
        },
        {
            timeInSeconds: 60,
            singularName: "minute",
            plurialName: "minutes"
        },
        {
            timeInSeconds: 1,
            singularName: "seconde",
            plurialName: "secondes"
        }
    ];

    units.sort((a, b) => b.timeInSeconds - a.timeInSeconds);
    time /= 1000;

    let result = units.map((unit) => {

        let amount = 0;
        while (time >= unit.timeInSeconds) {
            amount++;
            time -= unit.timeInSeconds;
        }

        return amount > 0 ? `${amount} ${amount > 1 ? unit.plurialName : unit.singularName}` : null;

    }).filter((amount) => !!amount).join(", ");

    const i = result.lastIndexOf(",");
    if (i > 0) result = result.substring(0, i) + " et" + result.substring(i + 1);

    return result || "Moins d'une seconde";
}

/**
 * Filter endpoints with a request and set url params to endpoint
 * @param {Endpoint[]} endpoints 
 * @param {import("./Request")} request 
 * @returns {Endpoint[]} 
 */
const filterEndpointsByPath = (endpoints, request) => endpoints.filter((endpoint) => {

    const currentParams = request.url.split("/");
    const requiredParams = endpoint.infos.path.split("/");

    if (currentParams.length !== requiredParams.length)
        return false;

    endpoint.params = {};

    for (let i = 0; i < requiredParams.length; i++)
        if (requiredParams[i].startsWith(":"))
            if (currentParams[i])
                endpoint.params[requiredParams[i].slice(1)] = currentParams[i];
            else
                return false;
        else if (requiredParams[i].toLowerCase() !== currentParams[i].toLowerCase())
            return false;

    return true;
});

/**
 * @typedef Endpoint 
 * @property {EndpointInfos} infos 
 * @property {Object} params 
 * @property {Function} run 
 */

/**
 * @typedef EndpointInfos 
 * @property {String} path 
 * @property {String} method 
 * @property {Boolean} requireAuth 
 */

/**
 * Add dashes to uuid
 * @param {String} uuid 
 * @returns {String} 
 */
const addDashesToUuid = (uuid) => `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;

/**
 * Fetch all users who reacted to a reaction 
 * @param {import("discord.js").MessageReaction} reaction 
 * @returns {Promise<import("discord.js").User[]>} 
 */
const fetchAllUsers = (reaction) => new Promise((resolve, reject) => {

    const result = [];

    const fetch = (after = null) => {

        reaction.users.fetch({ after }).then((users) => {

            if (users.size < 1) {
                resolve(result);
            } else {
                users.forEach((user) => result.push(user));
                fetch(users.last().id);
            }
        });
    }

    fetch();
});

/**
 * Run sql query with await/async
 * @param {import("mysql").Pool} database 
 * @param {String} sql 
 * @param {String[]} args 
 * @returns {Promise} 
 */
const query = (database, sql, args = []) => new Promise((resolve, reject) => {
    database.query(sql, args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
    });
});

/**
 * Generate random alphanumeric string with the given length
 * @param {Number} length 
 * @returns {String} 
 */
const randomString = (length) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

/**
 * @param {Number} year 
 * @param {Number} month 
 * @param {Number} day 
 * @returns {Date} 
 */
const getDate = (year, month, day) => {
    const date = new Date(year, month - 1, day, 1);
    if (date.getUTCDate() !== day) date.setUTCHours(date.getUTCHours() + 1);
    return date;
}

/**
 * @param {Date} date 
 * @returns {Number} 
 */
const getWeekNumber = (date) => {
    const tdt = new Date(date.valueOf());
    const dayn = (date.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

/**
 * @param {Date} date 
 * @returns {String} 
 */
const getTranslatedMonth = (date) => {
    const months = ["Janvier", "F??vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao??t", "Septembre", "Octobre", "Novembre", "D??cembre"];
    return months[date.getMonth()];
}

/**
 * @param {Date} date 
 * @returns {Date} 
 */
const getMonday = (date) => {
    while (date.getDay() !== 1)
        date.setDate(date.getDate() - 1);
    return date;
}

/**
 * @param {String} text 
 * @param {Number} limit 
 * @returns {String} 
 */
const addDots = (text, limit) => text.length > limit ? text.substring(0, limit - 3) + "..." : text;

const sortObjectsByStringField = (items, func) => {
    return items.sort((a, b) => {
        if (func(a) < func(b))
            return -1;
        if (func(a) > func(b))
            return 1;
        return 0;
    });
}

const getConfig = (dirPath) => Object.assign(require(dirPath + "/config.json"), Fs.existsSync(dirPath + "/config.dev.json") ? require(dirPath + "/config.dev.json") : {});

module.exports = {
    formatDuration,
    filterEndpointsByPath,
    addDashesToUuid,
    fetchAllUsers,
    query,
    randomString,
    getDate,
    getWeekNumber,
    getTranslatedMonth,
    getMonday,
    addDots,
    sortObjectsByStringField,
    getConfig
}