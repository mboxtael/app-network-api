const mockMe = jest
  .fn()
  .mockImplementationOnce(() => ({
    id: '123456',
    email: 'jhondoe@example.com',
    gender: 'male'
  }))
  .mockImplementationOnce(() => ({
    id: '123456',
    gender: 'male'
  }));
const mock = jest.fn().mockImplementation(() => ({ me: mockMe }));

exports.mockMe = mockMe;
exports.FB = mock;
