const mockConnect = jest.fn();
const mockOn = jest
  .fn()
  .mockImplementationOnce(() => {})
  .mockImplementationOnce((str, cb) => {
    cb({ message: { code: 'ETIMEDOUT' } });
  })
  .mockImplementationOnce((str, cb) => {
    cb({ message: { code: 'OTHER' } });
  });
const mockOnce = jest
  .fn((str, cb) => cb())
  .mockImplementationOnce((str, cb) => cb())
  .mockImplementationOnce(() => {});
const mockDropDatabase = jest.fn();

module.exports = {
  mockOn,
  mockConnect,
  mockDropDatabase,
  connect: mockConnect,
  connection: {
    on: mockOn,
    dropDatabase: mockDropDatabase,
    once: mockOnce
  }
};
