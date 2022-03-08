module.exports = {
    HttpServer: require("./src/HttpServer"),
    Request: require("./src/Request"),
    formatDuration: require("./src/otherUtils").formatDuration,
    filterEndpointsByPath: require("./src/otherUtils").filterEndpointsByPath,
    addDashesToUuid: require("./src/otherUtils").addDashesToUuid,
    fetchAllUsers: require("./src/otherUtils").fetchAllUsers,
    query: require("./src/otherUtils").query
}