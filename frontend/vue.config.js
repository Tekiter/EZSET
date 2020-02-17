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
        },
    },
}
