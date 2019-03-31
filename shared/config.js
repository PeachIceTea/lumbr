const config = {
    name: "lumbr",
    host: "192.168.0.5",
    port: 3000,
    database_pool: {
        host: "localhost",
        user: "root",
        database: "lum",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    },
    secret: "This is the safest secret in the world! Promise!",
    token_expiration: "2days",
    password_min_length: 8,
    password_rounds: 11,
    username_min_length: 4,
    username_max_length: 18,
    original_jpg_quality: 100,
    resized_jpg_quality: 85,
    thumb_jpg_quality: 85,
    address: "dont touch this",
}

config.address = `http://${config.host}:${config.port}`

module.exports = config
