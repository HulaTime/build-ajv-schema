import ArrayProperty from '../lib/ArrayProperty';
import BasicProperty from '../lib/BasicProperty';
import ObjectProperty from '../lib/ObjectProperty';
import { BasicPropertyTypes } from '../lib/types';

describe('ArrayProperty', () => {
  test('It should exist', () => {
    expect(ArrayProperty).toBeTruthy();
  });

  test('It should be a class', () => {
    const arrayProperty = new ArrayProperty('poop');
    expect(arrayProperty).toBeInstanceOf(ArrayProperty);
  });

  test('I can create a new Empty array object, with a name', () => {
    const arrayProperty = new ArrayProperty('emptyArray');
    expect(arrayProperty.items).toHaveLength(0);
  });

  test('I can add a new Basic Property to the Property items', () => {
    const arrayProperty = new ArrayProperty('filledArrayProp');
    const integerProperty = new BasicProperty('an integer', BasicPropertyTypes.integer);
    arrayProperty.addItem(integerProperty);
    expect(arrayProperty.items).toHaveLength(1);
    expect(arrayProperty.items[0]).toBe(integerProperty);
  });

  test('I can add a new Object Property to the Property items', () => {
    const arrayProperty = new ArrayProperty('filledArrayProp');
    const objectProperty = new ObjectProperty('an object');
    arrayProperty.addItem(objectProperty);
    expect(arrayProperty.items).toHaveLength(1);
    expect(arrayProperty.items[0]).toBe(objectProperty);
  });

  test('I can add a new Array Property to the Property items', () => {
    const arrayProperty = new ArrayProperty('filledArrayProp');
    const arrayProperty2 = new ArrayProperty('array 2');
    const objectProperty = new ObjectProperty('obj prop');
    arrayProperty2.addItem(objectProperty);
    arrayProperty.addItem(arrayProperty2);
    expect(arrayProperty.items).toHaveLength(1);
    expect(arrayProperty.items[0]).toBe(arrayProperty2);
  });
});
