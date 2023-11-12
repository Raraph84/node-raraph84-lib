module.exports = class MojangAPI {

    /**
     * @param {String} playerName 
     * @returns {Object} 
     */
    static async fetchPlayerNameAndUuid(playerName) {

        const req = await fetch("https://api.mojang.com/users/profiles/minecraft/" + playerName);

        if (req.status === 404)
            throw "This player does not exist";
        else if (req.status === 400)
            throw "Not valid player name";
        else if (req.status !== 200)
            throw "Not handled error";

        const player = await req.json();

        return player;
    }

    /**
     * @param {String} playerName 
     * @returns {String} 
     * @deprecated
     */
    static async fetchPlayerUuid(playerName) {
        return (await this.fetchPlayerNameAndUuid(playerName)).id;
    }

    /**
     * @param {String} playerUuid 
     * @param {Boolean} unsigned 
     * @returns {Object} 
     */
    static async fetchPlayerProfile(playerUuid, unsigned = false) {

        const req = await fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + playerUuid + (unsigned ? "?unsigned" : ""));

        if (req.status === 204)
            throw "This player does not exist";
        else if (req.status === 400)
            throw "Not valid UUID";
        else if (req.status !== 200)
            throw "Not handled error";

        const player = await req.json();

        return player;
    }
}
