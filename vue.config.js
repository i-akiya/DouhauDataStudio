module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {

      builderOptions: {
        mac: {
          icon: 'src/assets/mac.icns',
        },
        win: {
          icon: 'src/assets/app.ico',
        },
        files: [
          "**/*"
        ],
        extraFiles: [{
          "from": "rshiny",
          "to": "rshiny",
          "filter": ["**/*", "!rshiny.Rproj"]
        }, ]
      },
      preload: 'src/preload.js',
    }
  }
}
