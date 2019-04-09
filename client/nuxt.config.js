export default {
    head: {
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1, maximum-scale=1",
            },
            {
                hid: "description",
                name: "description",
            },
        ],
    },
    plugins: [{ src: "~/plugins/client-init", ssr: false }],
    router: {
        middleware: ["clearErrors"],
    },
}
