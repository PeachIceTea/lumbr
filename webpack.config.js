const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const VuePlugin = require("vue-loader/lib/plugin")

const config = {
    entry: path.resolve("./front-end/main.js"),
    output: {
        filename: "app.js",
        path: path.resolve("./dist"),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.pug$/,
                loader: "pug-plain-loader",
            },
            {
                test: /\.less$/,
                use: ["vue-style-loader", "css-loader", "less-loader"],
            },
        ],
    },
    plugins: [
        new HtmlPlugin({
            template: path.resolve("./template.html"),
            inject: false,
        }),
        new VuePlugin(),
    ],
    resolve: {
        extensions: [".js", ".json", ".vue"],
    },
    devtool: "source-map",
    mode: "development",
}

module.exports = config
