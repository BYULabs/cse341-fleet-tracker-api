const {
  vehicleCreateRules,
  vehicleUpdateRules,
  maintenanceLogCreateRules,
  maintenanceLogUpdateRules,
  validateRequest
} = require('./validation');

const runRules = async (rules, body) => {
  const req = { body };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  const next = jest.fn();

  await Promise.all(rules.map((rule) => rule.run(req)));
  validateRequest(req, res, next);

  return { req, res, next };
};

describe('collection request validation', () => {
  test('rejects invalid vehicle fields with structured errors', async () => {
    const { res, next } = await runRules(vehicleCreateRules, {
      vin: 'invalid',
      make: 'Honda',
      model: 'Accord',
      year: 'not-a-year',
      licensePlate: 'ABC123',
      mileage: -1,
      fuelType: 'Gasoline'
    });

    expect(res.status).toHaveBeenCalledWith(400);
    const [response] = res.json.mock.calls[0];
    expect(response.errors.map(({ path }) => path)).toEqual(
      expect.arrayContaining(['vin', 'year', 'mileage'])
    );
    expect(response.errors.every(({ msg, location }) => msg && location === 'body')).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows valid vehicle creation and partial updates', async () => {
    const vehicle = await runRules(vehicleCreateRules, {
      vin: '1HGCM82633A004352',
      make: 'Honda',
      model: 'Accord',
      year: '2020',
      licensePlate: 'ABC123',
      mileage: '25000',
      fuelType: 'Gasoline'
    });
    const update = await runRules(vehicleUpdateRules, { mileage: '125.5' });

    expect(vehicle.next).toHaveBeenCalled();
    expect(vehicle.req.body.year).toBe(2020);
    expect(vehicle.req.body.mileage).toBe(25000);
    expect(update.next).toHaveBeenCalled();
    expect(update.req.body.mileage).toBe(125.5);
  });

  test('rejects invalid maintenance-log date and numeric values', async () => {
    const { res, next } = await runRules(maintenanceLogCreateRules, {
      vehicleId: '507f1f77bcf86cd799439011',
      shopId: '507f1f77bcf86cd799439012',
      serviceDate: 'yesterday',
      serviceType: 'Oil Change',
      cost: 'unknown',
      odometerReading: -1
    });

    expect(res.status).toHaveBeenCalledWith(400);
    const [response] = res.json.mock.calls[0];
    expect(response.errors.map(({ path }) => path)).toEqual(
      expect.arrayContaining(['serviceDate', 'cost', 'odometerReading'])
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('allows valid maintenance-log creation and partial updates', async () => {
    const log = await runRules(maintenanceLogCreateRules, {
      vehicleId: '507f1f77bcf86cd799439011',
      shopId: '507f1f77bcf86cd799439012',
      serviceDate: '2025-04-15',
      serviceType: 'Oil Change',
      cost: '89.99',
      odometerReading: '42000'
    });
    const update = await runRules(maintenanceLogUpdateRules, { cost: '40' });

    expect(log.next).toHaveBeenCalled();
    expect(log.req.body.cost).toBe(89.99);
    expect(log.req.body.odometerReading).toBe(42000);
    expect(update.next).toHaveBeenCalled();
    expect(update.req.body.cost).toBe(40);
  });
});
