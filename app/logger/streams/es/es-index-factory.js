module.exports = (options, date = new Date()) => {
  return `${options.index.toLowerCase()}-${date.toISOString().slice(0, 7)}`
}
