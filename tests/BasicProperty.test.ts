import BasicProperty from '../lib/BasicProperty';
import { BasicPropertyTypes } from '../lib/types';

const basicPropertyTypes: BasicPropertyTypes[] = [
  BasicPropertyTypes.string,
  BasicPropertyTypes.integer,
  BasicPropertyTypes.number,
  BasicPropertyTypes.boolean,
  BasicPropertyTypes.null
];

describe('Basic Property', () => {
  test('It should exist', () => {
    expect(BasicProperty)
      .toBeTruthy();
  });

  test('It should be a class', () => {
    const property = new BasicProperty('prop', BasicPropertyTypes.string);
    expect(property)
      .toBeTruthy();
    expect(property)
      .toBeInstanceOf(BasicProperty);
  });

  basicPropertyTypes.forEach(propertyType => {
    test(`Can create a basic ${propertyType} property`, () => {
      const property = new BasicProperty(`${propertyType} type`, propertyType);
      expect(property.type)
        .toEqual(propertyType);
    });
  });

  test('Can specify a property is required', () => {
    const property = new BasicProperty('prop', BasicPropertyTypes.number, true);
    expect(property.isRequired)
      .toEqual(true);
  });
});
