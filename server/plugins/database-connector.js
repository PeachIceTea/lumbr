const config = require("../../shared/config")
const fastifyPlugin = require("fastify-plugin")
const mysql = require("mysql2/promise")

async function databaseConnector(fastify, options) {
    const db = await mysql.createPool(config.database_pool)
    fastify.decorate("mysql", db)
}

module.exports = fastifyPlugin(databaseConnector)
