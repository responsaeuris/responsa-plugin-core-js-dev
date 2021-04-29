module.exports = (input) => {
  const data = input[0] || []
  const plainResponse = () => data.err || data.res.statusCode !== 500

  if (typeof data === 'string' || (data.res && plainResponse())) return data
  return null
}
