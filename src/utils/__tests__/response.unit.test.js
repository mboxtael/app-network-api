const mongoose = require('mongoose');
const { responseErrors } = require('../response');

jest.unmock('mongoose');
const anySchema = new mongoose.Schema({
  field: { type: String, required: true }
});
const Any = mongoose.model('any', anySchema);

describe('#responseErrors', () => {
  it('should extract mongoose errors', () => {
    const invalidEntity = new Any({});
    const errors = responseErrors(invalidEntity.validateSync());

    expect(errors).toEqual(expect.objectContaining({
      field: expect.objectContaining({
        type: expect.stringMatching('required'),
        message: expect.any(String)
      })
    }));
  });
});
