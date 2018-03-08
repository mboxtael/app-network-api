exports.modelToJSON = model => ({
  ...model.toJSON(),
  _id: model._id.toString()
});
