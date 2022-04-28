const { default: fetch } = require("node-fetch");

module.exports = class MojangAPI {

    static async fetchPlayerUuid(playerName) {

        const req = await fetch("https://api.mojang.com/users/profiles/minecraft/" + playerName);

        if (req.status === 204)
            throw "This user doesn't exist";

        const user = await req.json();

        return user.id;
    }

    static async fetchPlayerProfile(playerUuid, unsigned = false) {

        const req = await fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + playerUuid + (unsigned ? "?unsigned" : ""));

        if (req.status === 400)
            throw "This user doesn't exist";

        const user = await req.json();

        return user;
    }
}