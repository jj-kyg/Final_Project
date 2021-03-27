// require and re-export all files

module.exports = {
  ...require('./customers'),
  ...require('./reviews'),
  ...require('./products')
}