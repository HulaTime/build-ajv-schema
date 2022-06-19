import Ajv from 'ajv';

import BasicProperty from './BasicProperty';
import ObjectProperty from './ObjectProperty';
import { BasicSchemaProperty, ISchema, ObjectSchemaProperty, PropertyTypes, } from './types';

const isObjectProperty = (prop: BasicProperty | ObjectProperty): prop is ObjectProperty =>
  prop instanceof ObjectProperty;

const compileBasicProperty = (basicProperty: BasicProperty): BasicSchemaProperty => ({
  type: basicProperty.type,
  // format: property.format
});

const objectPropertyReducer = (
  objectSchemaProp: ObjectSchemaProperty,
  property: BasicProperty | ObjectProperty
): ObjectSchemaProperty => {
  if (!objectSchemaProp.required) {
    objectSchemaProp.required = [];
  }
  if (property.isRequired) {
    objectSchemaProp.required.push(property.name);
  }
  if (isObjectProperty(property)) {
    objectSchemaProp.additionalProperties = property.additionalProperties;
    objectSchemaProp.properties[property.name] = compileObjectProperty(property);
  } else {
    objectSchemaProp.properties[property.name] = compileBasicProperty(property);
  }
  return objectSchemaProp;
};

const compileObjectProperty = (property: ObjectProperty): ObjectSchemaProperty => {
  const initialObjectSchema: ObjectSchemaProperty = {
    type: PropertyTypes.object,
    properties: {},
  };
  return property.childProperties.reduce(objectPropertyReducer, initialObjectSchema);
};

export default class Schema {
  private ajv = new Ajv();

  private schema: ISchema = {
    type: PropertyTypes.object,
    properties: {},
    required: [],
    additionalProperties: true
  };

  constructor(options?: { allowAdditionalProperties?: boolean }) {
    if (options && typeof options.allowAdditionalProperties === 'boolean') {
      this.schema.additionalProperties = options.allowAdditionalProperties;
    }
  }

  public addProperty(property: BasicProperty | ObjectProperty): Schema {
    if (isObjectProperty(property)) {
      this.schema.properties[property.name] = compileObjectProperty(property);
    } else {
      this.schema.properties[property.name] = compileBasicProperty(property);
    }
    if (property.isRequired) {
      if (!this.schema.required) {
        this.schema.required = [];
      }
      this.schema.required.push(property.name);
    }
    try {
      this.ajv.compile(this.schema);
      return this;
    } catch (err: any) {
      if (err instanceof Error && err.message.includes(`data/properties/${property.name}/type`)) {
        throw new Error(`${property.type} is not a valid property type`);
      }
      throw err;
    }
  }

  public generate(): ISchema {
    return this.schema;
  }
}
