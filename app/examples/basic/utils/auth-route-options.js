module.exports = {
  schema: {
    tags: ['auth'],
    summary: 'Sample route to test auth schema security options',
    description: 'Tests that security schema options are working as expected',
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  }
}
