const { MessageReaction, User } = require("discord.js");
const Request = require("./Request");

/**
 * @param {number} time 
 * @returns {string} 
 */
module.exports.formatDuration = (time) => {

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
 * @param {Array<Endpoint>} endpoints 
 * @param {Request} request 
 * @returns {Array<Endpoint>} 
 */
module.exports.filterEndpointsByPath = (endpoints, request) => endpoints.filter((endpoint) => {

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
 * @property {string} path 
 * @property {string} method 
 * @property {boolean} requireAuth 
 */

/**
 * @param {String} uuid 
 * @returns {String} 
 */
module.exports.addDashesToUuid = (uuid) => `${uuid.substring(0, 8)}-${uuid.substring(8, 4)}-${uuid.substring(12, 4)}-${uuid.substring(16, 4)}-${uuid.substring(20)}`;

/**
 * @param {MessageReaction} reaction 
 * @returns {Promise<Array<User>>}
 */
module.exports.fetchAllUsers = (reaction) => new Promise((resolve, reject) => {

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