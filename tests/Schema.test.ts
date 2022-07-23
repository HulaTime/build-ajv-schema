import Schema from '../lib/Schema';
import BasicProperty from '../lib/BasicProperty';
import ObjectProperty from '../lib/ObjectProperty';
import { BasicPropertyTypes, BasicSchemaProperty, ObjectPropertyTypes, ObjectSchemaProperty } from '../lib/types';

import { complexSchemaResult, emptySchema } from './testMaterials';

const isObjectSchemaProperty =
  (property: ObjectSchemaProperty | BasicSchemaProperty): property is ObjectSchemaProperty =>
    property.type === ObjectPropertyTypes.object;

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
      .toEqual(false);
    const noAdditionalPropertiesSchema = new Schema({ allowAdditionalProperties: true });
    expect(noAdditionalPropertiesSchema.generate().additionalProperties)
      .toEqual(true);
  });

  describe('Adding properties to the schema', () => {
    let schema: Schema;

    beforeEach(() => {
      schema = new Schema();
    });

    test('I can add a string property', () => {
      const stringProperty = new BasicProperty('string prop', BasicPropertyTypes.string);
      schema.addProperty(stringProperty);
      const output = schema.generate();
      expect(output.properties)
        .toHaveProperty('string prop');
      expect(output.properties['string prop'])
        .toEqual({ type: 'string' });
    });

    test('I can add a number property', () => {
      const numberProperty = new BasicProperty('num prop', BasicPropertyTypes.number);
      schema.addProperty(numberProperty);
      const output = schema.generate();
      expect(output.properties)
        .toHaveProperty('num prop');
      expect(output.properties['num prop'])
        .toEqual({ type: 'number' });
    });

    test('I can add an integer property', () => {
      const intProperty = new BasicProperty('int prop', BasicPropertyTypes.integer);
      schema.addProperty(intProperty);
      const output = schema.generate();
      expect(output.properties)
        .toHaveProperty('int prop');
      expect(output.properties['int prop'])
        .toEqual({ type: 'integer' });
    });

    test('I can add an object property', () => {
      const propertyName = 'object property';
      const objectProp = new ObjectProperty(propertyName);
      schema.addProperty(objectProp);
      const schemaOutput = schema.generate();
      expect(schemaOutput.properties).toHaveProperty(propertyName);
      const property = schemaOutput.properties[propertyName];
      if (!isObjectSchemaProperty(property)) {
        throw new Error('Property has wrong type');
      }
      expect(property.type).toEqual('object');
      expect(property.properties).toEqual({});
      expect(property.additionalProperties).toEqual(false);
      expect(property.required).toEqual([]);
    });

    describe('Errors', () => {
      test('I should get an error if I try and supply an unsupported property type', () => {
        const addBadPropertyType = (): void => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const sillyProperty = new BasicProperty('badprop', 'sillygoose');
          schema.addProperty(sillyProperty);
        };
        expect(addBadPropertyType)
          .toThrowError('sillygoose is not a valid property type');
      });
    });
  });

  describe('Adding complex properties to the schema', () => {
    let schema: Schema;

    beforeEach(() => {
      schema = new Schema();
    });

    test('I can add an object property and it should properly construct a schema based on the property attributes', () => {
      const primaryObjectName = 'user';
      const agePropName = 'age';
      const weightPropName = 'weight';
      const weightValueName = 'value';
      const weightUnitName = 'unit';
      const objectProp = new ObjectProperty(primaryObjectName)
        .allowAdditionalProperties(true)
        .addProperty(
          new BasicProperty(agePropName, BasicPropertyTypes.integer, true)
        )
        .addProperty(
          new ObjectProperty(weightPropName, false)
            .allowAdditionalProperties(false)
            .addProperty(
              new BasicProperty(weightValueName, BasicPropertyTypes.number, true)
            )
            .addProperty(
              new BasicProperty(weightUnitName, BasicPropertyTypes.string, true)
            )
        );
      schema.addProperty(objectProp);
      const schemaOutput = schema.generate();
      expect(schemaOutput.properties).toHaveProperty(primaryObjectName);
      const mainProperty = schemaOutput.properties[primaryObjectName];
      if (!isObjectSchemaProperty(mainProperty)) {
        throw new Error('Property has wrong type');
      }
      expect(mainProperty.type).toEqual('object');
      expect(mainProperty.required).toEqual([agePropName]);
      expect(Object.keys(mainProperty.properties)).toEqual([agePropName, weightPropName]);
      expect(mainProperty.additionalProperties).toEqual(true);

      const { [agePropName]: ageSchemaProp, [weightPropName]: weightSchemaProp } = mainProperty.properties;
      expect(ageSchemaProp.type).toEqual('integer');
      if (!isObjectSchemaProperty(weightSchemaProp)) {
        throw new Error('Weight property is wrong type');
      }
      expect(weightSchemaProp.type).toEqual('object');
      expect(weightSchemaProp.required).toEqual([weightValueName, weightUnitName]);
      expect(weightSchemaProp.additionalProperties).toBe(false);
      expect(weightSchemaProp.properties[weightUnitName].type).toEqual('string');
      expect(weightSchemaProp.properties[weightValueName].type).toEqual('number');
    });

    test('I can build a complex schema with multiple different types and nested attributes', () => {
      const schema = new Schema({ allowAdditionalProperties: false });
      const firstName = new BasicProperty('firstName', BasicPropertyTypes.string, true);
      const lastName = new BasicProperty('lastName', BasicPropertyTypes.string, true);
      const age = new BasicProperty('age', BasicPropertyTypes.integer, true);
      const weight = new BasicProperty('weight', BasicPropertyTypes.number, false);
      const address = new ObjectProperty('address', true)
        .allowAdditionalProperties(false);
      const addressMeta = new ObjectProperty('meta');
      addressMeta
        .allowAdditionalProperties(true)
        .addProperty(new BasicProperty('value', BasicPropertyTypes.number))
        .addProperty(new BasicProperty('description', BasicPropertyTypes.string));
      address
        .addProperty(new BasicProperty('firstLine', BasicPropertyTypes.string, true))
        .addProperty(new BasicProperty('secondLine', BasicPropertyTypes.string, false))
        .addProperty(new BasicProperty('postCode', BasicPropertyTypes.string, true))
        .addProperty(new BasicProperty('city', BasicPropertyTypes.string, true))
        .addProperty(addressMeta);
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
});
