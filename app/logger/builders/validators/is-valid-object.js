const hasValue = require('./has-value')

module.exports = (obj) => hasValue(obj) && Object.keys(obj).length > 0 && typeof obj === 'object'
