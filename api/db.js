const config = require("../config")
const mysql = require("mysql2/promise")

const db = mysql.createPool(config.database)

db.queryMany = async function(sql, values) {
    if (values) return (await this.execute(sql, values))[0]
    else return (await this.execute(sql))[0]
}

db.queryOne = async function(sql, values) {
    if (values) return (await this.queryMany(sql, values))[0]
    else return (await this.queryMany(sql))[0]
}

db.queryInfo = db.queryMany

module.exports = db
