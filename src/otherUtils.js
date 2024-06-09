const Fs = require("fs");
const Path = require("path");

/**
 * Format duration in french
 * @param {number} time 
 * @returns {string} 
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
 * @property {object} params 
 * @property {Function} run 
 */

/**
 * @typedef EndpointInfos 
 * @property {string} path 
 * @property {string} method 
 * @property {boolean} requireAuth 
 */

/**
 * Add dashes to uuid
 * @param {string} uuid 
 * @returns {string} 
 */
const addDashesToUuid = (uuid) => `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;

/**
 * Fetch all users who reacted to a reaction 
 * @param {import("discord.js").MessageReaction} reaction 
 * @returns {Promise<import("discord.js").User[]>} 
 */
const fetchAllUsers = async (reaction) => {

    const result = [];

    const fetch = async (after) => {

        const users = await reaction.users.fetch({ after, limit: 100 });
        for (const user of users.values())
            result.push(user)

        if (users.size >= 100)
            await fetch(users.last().id);
    }

    await fetch();
    return result;
}

/**
 * Run sql query with await/async
 * @param {import("mysql").Pool} database 
 * @param {string} sql 
 * @param {string[]} args 
 * @returns {Promise<import("mysql").FieldInfo[]>} 
 * @deprecated Use mysql2/promise instead 
 */
const query = (database, sql, args = []) => new Promise((resolve, reject) => {
    database.query(sql, args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
    });
});

/**
 * Generate random alphanumeric string with the given length
 * @param {number} length 
 * @returns {string} 
 */
const randomString = (length, chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") => {
    let result = "";
    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

/**
 * Get current date in french
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @returns {Date} 
 * @deprecated 
 */
const getDate = (year, month, day) => {
    const date = new Date(year, month - 1, day, 1);
    if (date.getUTCDate() !== day) date.setUTCHours(date.getUTCHours() + 1);
    return date;
}

/**
 * Get current week number from the start of the year
 * @param {Date} date 
 * @returns {number} 
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
 * Get month name in french from a date
 * @param {Date} date 
 * @returns {string} 
 */
const getTranslatedMonth = (date) => {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return months[date.getMonth()];
}

/**
 * Get the date of the monday of the week of the date
 * @param {Date} date 
 * @returns {Date} 
 */
const getMonday = (date) => {
    while (date.getDay() !== 1)
        date.setDate(date.getDate() - 1);
    return date;
}

/**
 * Add dots to a too long string
 * @param {string} text 
 * @param {number} limit 
 * @returns {string} 
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

/**
 * Get the config of the project
 * @param {string} dirPath 
 * @returns {object} 
 */
const getConfig = (dirPath) => ({ ...require(dirPath + "/config.json"), ...(Fs.existsSync(dirPath + "/config.dev.json") ? require(dirPath + "/config.dev.json") : {}) });

/**
 * Copy a file or a directory recursively
 * @param {string} src 
 * @param {string} dest 
 */
const copyFile = (src, dest) => {

    if (Fs.statSync(src).isDirectory()) {

        if (!Fs.existsSync(dest))
            Fs.mkdirSync(dest, { recursive: true });

        for (const file of Fs.readdirSync(src))
            copyFile(Path.join(src, file), Path.join(dest, file));

    } else
        Fs.copyFileSync(src, dest);
}

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
    getConfig,
    copyFile
}
