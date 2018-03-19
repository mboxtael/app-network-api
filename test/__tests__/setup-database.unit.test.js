const { mockConnect, mockOn, mockDropDatabase } = require('mongoose');
const { prepareDB, config } = require('../setup-database');

jest.mock('mongoose');

beforeEach(() => {
  mockConnect.mockClear();
  config.connection = null;
});

describe('setupDatabase', () => {
  it('should connect sucessfully to DB and drop previous data', async () => {
    await expect(prepareDB()).resolves.not.toThrow();
    expect(mockConnect).toHaveBeenCalled();
    expect(mockOn).toHaveBeenCalled();
    expect(mockDropDatabase).toHaveBeenCalled();
  });

  it('should try reconnect on mongo ETIMEDOUT', async () => {
    prepareDB();
    expect(mockConnect).toHaveBeenCalledTimes(2);
  });

  it('should throw error in unknow connection error', async () => {
    await expect(prepareDB()).rejects.toThrow();
  });

  it('should use previous connection', async () => {
    await prepareDB();
    await prepareDB();
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
});
