module.exports = {
    port: 3000,
    database_pool: {
        host: "localhost",
        user: "root",
        database: "lum",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    },
    token_expiration: "2days",
    secret: "This is the safest secret in the world! Promise!",
    password_min_length: 8,
    password_rounds: 11,
    username_min_length: 4,
    username_max_length: 18,
}
