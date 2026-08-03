const crypto = require('crypto')
const config = require('../config/config')

exports.encrypt = (text) => {
  const cipher = crypto.createCipher(config.ALG, config.SALT_KEY)
  const crypted = cipher.update(text, 'utf8', 'hex')
  return crypted
}
exports.decrypt = (text) => {
  const decipher = crypto.createDecipher(config.ALG, config.SALT_KEY)
  const plain = decipher.update(text, 'hex', 'utf8')
  return plain
}
