import Schema from '../lib/Schema';
import BasicProperty from '../lib/BasicProperty';
import ObjectProperty from '../lib/ObjectProperty';
import { PropertyTypes } from '../lib/types';

import { complexSchemaResult, emptySchema } from './testMaterials';

describe('Schema', () => {
  test('It should exist', () => {
    expect(Schema)
      .toBeTruthy();
  });

  test('It should be a class', () => {
    expect(new Schema())
      .toBeTruthy();
  });

  test('It can generate a default empty schema object', () => {
    const schema = new Schema();
    const output = schema.generate();
    expect(output)
      .toEqual(emptySchema);
  });

  test('I can specify whether the schema should allow additional properties or not', () => {
    const additionalPropertiesSchema = new Schema();
    expect(additionalPropertiesSchema.generate().additionalProperties)
      .toEqual(true);
    const noAdditionalPropertiesSchema = new Schema({ allowAdditionalProperties: false });
    expect(noAdditionalPropertiesSchema.generate().additionalProperties)
      .toEqual(false);
  });

  describe('Adding properties to the schema', () => {
    let schema: Schema;

    beforeEach(() => {
      schema = new Schema();
    });

    test('I can add a string property', () => {
      const stringProperty = new BasicProperty('string prop', PropertyTypes.string);
      schema.addProperty(stringProperty);
      const output = schema.generate();
      expect(output.properties)
        .toHaveProperty('string prop');
      expect(output.properties['string prop'])
        .toEqual({ type: 'string' });
    });

    test('I can add a number property', () => {
      const numberProperty = new BasicProperty('num prop', PropertyTypes.number);
      schema.addProperty(numberProperty);
      const output = schema.generate();
      expect(output.properties)
        .toHaveProperty('num prop');
      expect(output.properties['num prop'])
        .toEqual({ type: 'number' });
    });

    test('I can add an integer property', () => {
      const intProperty = new BasicProperty('int prop', PropertyTypes.integer);
      schema.addProperty(intProperty);
      const output = schema.generate();
      expect(output.properties)
        .toHaveProperty('int prop');
      expect(output.properties['int prop'])
        .toEqual({ type: 'integer' });
    });

    describe('Errors', () => {
      test('I should get an error if I try and supply an unsupported property type', () => {
        const addBadPropertyType = (): void => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const sillyProperty = new Property('badprop', 'sillygoose');
          schema.addProperty(sillyProperty);
        };
        expect(addBadPropertyType)
          .toThrowError('sillygoose is not a valid property type');
      });
    });
  });

  test('I can build a complex schema with multiple different types and nested attributes', () => {
    const schema = new Schema({ allowAdditionalProperties: false });
    const firstName = new BasicProperty('firstName', PropertyTypes.string, true);
    const lastName = new BasicProperty('lastName', PropertyTypes.string, true);
    const age = new BasicProperty('age', PropertyTypes.integer, true);
    const weight = new BasicProperty('weight', PropertyTypes.number, false);
    const address = new ObjectProperty('address', true);
    address
      .addProperty(new BasicProperty('firstLine', PropertyTypes.string, true))
      .addProperty(new BasicProperty('secondLine', PropertyTypes.string, false))
      .addProperty(new BasicProperty('postCode', PropertyTypes.string, true))
      .addProperty(new BasicProperty('city', PropertyTypes.string, true));
    schema
      .addProperty(firstName)
      .addProperty(lastName)
      .addProperty(age)
      .addProperty(weight)
      .addProperty(address);
    expect(schema.generate())
      .toEqual(complexSchemaResult);
  });
});
