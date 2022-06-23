import ObjectProperty from '../lib/ObjectProperty';
import BasicProperty from '../lib/BasicProperty';
import { BasicPropertyTypes } from '../lib/types';

describe('Object Property', () => {
  test('I can add another property to an object property', () => {
    const property = new ObjectProperty('object prop');
    const stringProp = new BasicProperty('string prop', BasicPropertyTypes.string);
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
