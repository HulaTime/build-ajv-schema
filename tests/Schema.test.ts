import Schema from '../lib/Schema';
import { emptySchema } from './testMaterials';

describe('Schema', () => {
  test('It should exist', () => {
    expect(Schema).toBeTruthy();
  });

  test('It should be a class', () => {
    expect(new Schema()).toBeTruthy();
  });

  test('It can generate a default empty schema object', () => {
    const schema = new Schema();
    const output = schema.generate();
    expect(output).toEqual(emptySchema);
  });

  test('I can specify whether the schema should allow additional properties or not', () => {
    const additionalPropertiesSchema = new Schema();
    expect(additionalPropertiesSchema.generate().additionalProperties).toEqual(true);
    const noAdditionalPropertiesSchema = new Schema({ allowAdditionalProperties: false });
    expect(noAdditionalPropertiesSchema.generate().additionalProperties).toEqual(false);
  });

  describe('Adding properties to the schema', () => {
    let schema: Schema;

    beforeEach(() => {
      schema = new Schema();
    });

    test('I can add a string property', () => {
      schema.addProperty('name', 'string');
      const output = schema.generate();
      expect(output.properties).toHaveProperty('name');
      expect(output.properties.name).toEqual({ type: 'string' });
    });

    test('I can add a number property', () => {
      schema.addProperty('number', 'number');
      const output = schema.generate();
      expect(output.properties).toHaveProperty('number');
      expect(output.properties.number).toEqual({ type: 'number' });
    });

    test('I can add an integer property', () => {
      schema.addProperty('int', 'integer');
      const output = schema.generate();
      expect(output.properties).toHaveProperty('int');
      expect(output.properties.int).toEqual({ type: 'integer' });
    });

    describe('Errors', () => {
      test('I should get an error if I try and supply an unsupported property type', () => {
        const addBadPropertyType = (): void => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          schema.addProperty('badprop', 'sillygoose');
        };
        expect(addBadPropertyType).toThrowError('sillygoose is not a valid property type');
      });
    });
  });
});
