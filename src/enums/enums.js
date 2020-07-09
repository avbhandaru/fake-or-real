module.exports = {
  REAL: 'real',
  FAKE: 'fake',
  ERROR: (dirname) => `ERROR [${dirname}]:`,
  MONGO_URI: (UN, PW) => `mongodb+srv://${UN}:${PW}@real-or-fake.aqihu.mongodb.net/fake-or-real?retryWrites=true&w=majority`,
  POST_STATUS: (id, status, msg = '') => {
    return {
      _id: id,
      status: status,
      msg: msg
    }
  }
}