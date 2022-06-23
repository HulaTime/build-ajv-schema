import Ajv from 'ajv';

import BasicProperty from './BasicProperty';
import ObjectProperty from './ObjectProperty';
import { BasicSchemaProperty, ISchema, ObjectPropertyTypes, ObjectSchemaProperty, } from './types';

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
  if (property.isRequired) {
    objectSchemaProp.required.push(property.name);
  }
  if (isObjectProperty(property)) {
    objectSchemaProp.properties[property.name] = compileObjectProperty(property);
  } else {
    objectSchemaProp.properties[property.name] = compileBasicProperty(property);
  }
  return objectSchemaProp;
};

const compileObjectProperty = (property: ObjectProperty): ObjectSchemaProperty => {
  const initialObjectSchema: ObjectSchemaProperty = {
    type: ObjectPropertyTypes.object,
    additionalProperties: property.additionalProperties,
    required: [],
    properties: {},
  };
  return property.childProperties.reduce(objectPropertyReducer, initialObjectSchema);
};

export default class Schema {
  private ajv = new Ajv();

  private schema: ISchema = {
    type: ObjectPropertyTypes.object,
    properties: {},
    required: [],
    additionalProperties: false
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
    if (!this.schema.required) {
      this.schema.required = [];
    }
    if (property.isRequired) {
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
