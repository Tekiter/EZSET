module.exports = {
    transpileDependencies: ['vuetify'],

    publicPath: '/',

    outputDir: '../backend/public/',

    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',

                changeOrigin: true,
            },

            '/socket.io': {
                target: 'http://localhost:5050',

                changeOrigin: true,
            },
        },
    },
}
