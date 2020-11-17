import interpolate from './interpolate';
import './ArrayExtensionMethods';

test('should work', () => {
    const arr = [1, 2, 3, 4];
    const result = interpolate(10, arr);
    expect(result).toStrictEqual([1, 10, 2, 10, 3, 10, 4]);
});

test('any should work', () => {


    const arr1 = [1, 2, 3, 4, 5];
    const result1 = arr1.any(x => x === 5);
    expect(result1).toBe(true);

    const arr2 = [1, 2, 3, 4, 5];
    const result2 = arr2.any(x => x === 6);
    expect(result2).toBe(false);

});