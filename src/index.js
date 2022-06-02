const OtherUtils = require("./otherUtils");

module.exports = {
    Base64: require("./Base64"),
    DockerEventListener: require("./DockerEventListener"),
    HttpServer: require("./HttpServer"),
    MojangAPI: require("./MojangAPI"),
    Request: require("./Request"),
    formatDuration: OtherUtils.formatDuration,
    filterEndpointsByPath: OtherUtils.filterEndpointsByPath,
    addDashesToUuid: OtherUtils.addDashesToUuid,
    fetchAllUsers: OtherUtils.fetchAllUsers,
    query: OtherUtils.query,
    randomString: OtherUtils.randomString,
    getDate: OtherUtils.getDate,
    getWeekNumber: OtherUtils.getWeekNumber,
    getTranslatedMonth: OtherUtils.getTranslatedMonth,
    getMonday: OtherUtils.getMonday,
    addDots: OtherUtils.addDots,
    sortObjectsByStringField: OtherUtils.sortObjectsByStringField,
    getConfig: OtherUtils.getConfig
}
