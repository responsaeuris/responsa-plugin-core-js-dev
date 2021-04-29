const builder = require('./../builders/logger-builder')

module.exports.bindings = (bindings) => {
  return { pid: bindings.pid, machineName: bindings.hostname }
}

module.exports.log = (input) => {
  if (typeof input === 'string' || !input.res) return input

  const { res } = input
  const { err } = input
  const { request } = res

  return builder(request, res.raw, err, input.responseTime)
}
