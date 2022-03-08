const { test, expect } = require('@jest/globals');
const { distanceTo } = require('./index');

test('tests distance from two points', () => {
    expect(distanceTo([51, 0], [51.00089831528412, 0])).toBe(99.99999999985421);
});
test('tests distance with invalid from', () => {
    expect(() => distanceTo([51], [51.00089831528412, 0])).toThrowError(new Error('From must be an array of two numbers representing latitude and longitude.'));
});
test('tests distance with invalid to', () => {
    expect(() => distanceTo([51, 0], [51.00089831528412])).toThrowError(new Error('To must be an array of two numbers representing latitude and longitude.'));
});