const Vehicle = require('./Vehicle');

describe('Vehicle model', () => {
  test('normalizes VIN and license plate before validation', async () => {
    const vehicle = new Vehicle({
      vin: '1hgcm82633a004352',
      make: ' Honda ',
      model: ' Accord ',
      year: 2020,
      licensePlate: ' abc 123 ',
      mileage: 25000,
      fuelType: 'Gasoline'
    });

    expect(vehicle.vin).toBe('1HGCM82633A004352');
    expect(vehicle.make).toBe('Honda');
    expect(vehicle.licensePlate).toBe('ABC 123');
    expect(vehicle.status).toBe('Active');
    await expect(vehicle.validate()).resolves.toBeUndefined();
  });

  test('rejects invalid VIN and fuel type values', async () => {
    const vehicle = new Vehicle({
      vin: 'invalid',
      make: 'Honda',
      model: 'Accord',
      year: 2020,
      licensePlate: 'ABC 123',
      mileage: 25000,
      fuelType: 'Steam'
    });

    await expect(vehicle.validate()).rejects.toMatchObject({
      errors: {
        vin: expect.anything(),
        fuelType: expect.anything()
      }
    });
  });
});