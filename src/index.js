const OtherUtils = require("./otherUtils");

module.exports = {
    Base64: require("./Base64"),
    HttpServer: require("./HttpServer"),
    Request: require("./Request"),
    Docker: require("./Docker"),
    formatDuration: OtherUtils.formatDuration,
    filterEndpointsByPath: OtherUtils.filterEndpointsByPath,
    addDashesToUuid: OtherUtils.addDashesToUuid,
    fetchAllUsers: OtherUtils.fetchAllUsers,
    query: OtherUtils.query,
    randomString: OtherUtils.randomString,
    getDate: OtherUtils.getDate,
    getWeekNumber: OtherUtils.getWeekNumber,
    getTranslatedMonth: OtherUtils.getTranslatedMonth,
    getMonday: OtherUtils.getMonday
}