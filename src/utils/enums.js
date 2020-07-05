module.exports = {
  ERROR: (dirname) => `ERROR [${dirname}]:`,
  MONGO_URI: (UN, PW) => `mongodb+srv://${UN}:${PW}@real-or-fake.aqihu.mongodb.net/fake-or-real?retryWrites=true&w=majority`
}