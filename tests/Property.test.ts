import BasicProperty from '../lib/BasicProperty';
import ObjectProperty from '../lib/ObjectProperty';
import { PropertyTypes } from '../lib/types';

const basicPropertyTypes: Exclude<PropertyTypes, PropertyTypes.object>[] = [
  PropertyTypes.string,
  PropertyTypes.integer,
  PropertyTypes.number,
  PropertyTypes.boolean, PropertyTypes.array,
  PropertyTypes.null
];

describe('Testing property types', () => {
  describe('Basic Property', () => {
    test('It should exist', () => {
      expect(BasicProperty)
        .toBeTruthy();
    });

    test('It should be a class', () => {
      const property = new BasicProperty('prop', PropertyTypes.string);
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
      const property = new BasicProperty('prop', PropertyTypes.number, true);
      expect(property.isRequired)
        .toEqual(true);
    });
  });

  describe('Object Property', () => {
    test('I can add another property to an object property', () => {
      const property = new ObjectProperty('object prop');
      const stringProp = new BasicProperty('string prop', PropertyTypes.string);
      property.addProperty(stringProp);
    });

    test('Should default to not allowing additional properties', () => {
      const property = new ObjectProperty('object prop');
      expect(property.additionalProperties)
        .toEqual(false);
    });

    test('I can allow additional properties', () => {
      const property = new ObjectProperty('object prop');
      property.allowAdditionalProperties();
      expect(property.additionalProperties)
        .toEqual(true);
    });
  });
});
