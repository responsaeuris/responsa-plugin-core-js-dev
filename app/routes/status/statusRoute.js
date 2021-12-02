const status = async () => {
  const ciCommit = 'a72ef81e0afb29e957ccbe373334d64a0a2caa16 Merge tag _0.2.6_ into develop'
  const lastDeploy = 'Thu Dec  2 16:07:04 UTC 2021'

  return `ok! Plugin Core released on ${lastDeploy}, last commit was "${ciCommit}"`
}

module.exports = async function (fastify) {
  fastify.get('/', status)
}

module.exports.status = status
