const status = async () => {
  const ciCommit = 'd38e2077cb3dbb9135f3691ba815d9a03766391d chore_ upgrade version to 0.2.5'
  const lastDeploy = 'Thu Jul 15 10:23:30 UTC 2021'

  return `ok! Plugin Core released on ${lastDeploy}, last commit was "${ciCommit}"`
}

module.exports = async function (fastify) {
  fastify.get('/', status)
}

module.exports.status = status
