const handleError = require('./handleError');

describe('handleError', () => {
  const createResponse = () => {
    const res = {
      status: jest.fn(),
      json: jest.fn()
    };
    res.status.mockReturnValue(res);
    return res;
  };

  test('returns validation errors as a bad request', () => {
    const res = createResponse();
    const next = jest.fn();
    const error = {
      name: 'ValidationError',
      errors: {
        vin: { message: 'VIN is required' },
        make: { message: 'Make is required' }
      }
    };

    handleError(error, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation failed',
      errors: ['VIN is required', 'Make is required']
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('passes unknown errors to Express error middleware', () => {
    const res = createResponse();
    const next = jest.fn();
    const error = new Error('Unexpected failure');

    handleError(error, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});