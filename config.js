const config = {
    database: {
        host: "localhost",
        user: "root",
        database: "lumbar",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    },
    api: {
        port: 3000,
    },
    validation: {
        username_min_length: 4,
        username_max_length: 25,
        password_min_length: 8,
        comment_min_length: 1,
        comment_max_length: 1000,
    },
    password_rounds: 11,
    secret: 'THIS IS A super SAFE secret_!sadknhj" Promise :)',
    address: "http://192.168.0.5:3000",
    accepted_mime: ["image/png", "image/jpeg"],
}

module.exports = config
