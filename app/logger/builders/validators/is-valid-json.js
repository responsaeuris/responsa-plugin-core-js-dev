module.exports = (input) => {
  try {
    JSON.parse(input)
    return true
  } catch (error) {
    return false
  }
}
