module.exports.sample0 = {
  $id: 'sample0',
  type: 'object',
  title: 'Sample0 schema title',
  description: 'Sample0 schema description',
  properties: {
    sampleProperty: {
      type: 'number',
      description: 'Sample0 property',
      nullable: true
    }
  }
}

module.exports.sample1 = {
  $id: 'sample1',
  type: 'object',
  title: 'Sample1 schema title',
  description: 'Sample1 schema description',
  addToSwagger: true,
  properties: {
    sampleProperty: {
      type: 'number',
      description: 'Sample1 property',
      nullable: true
    }
  }
}
