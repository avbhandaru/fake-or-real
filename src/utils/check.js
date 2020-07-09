const { REAL, FAKE } = require('../enums/enums');

module.exports = {
  isReal: value => { value === REAL },
  isFake: value => { value === FAKE }
}