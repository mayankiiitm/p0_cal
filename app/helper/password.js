const bcrypt = require('bcrypt')

module.exports = {
	hashPassword: (password) => bcrypt.hash(password, 10),
	matchPassword: (password, hash) => bcrypt.compare(password, hash),
}
