import Ajv from 'ajv';
// import { FormatName } from 'ajv-formats';

type BasicType = 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object' | 'null'

interface Property {
  type: 'object';
  properties: ObjectProperty | BasicProperty;
  required: string[];
  additionalProperties?: boolean;
}

type BaseSchema = Property;

interface BasicProperty {
  [key: string]: {
    type: BasicType;
    // format?: FormatName;
  };
}

interface ObjectProperty {
  [key: string]: Property;
}

export default class Schema {
  private ajv = new Ajv();

  private schema: BaseSchema = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: true
  };

  constructor(options?: { allowAdditionalProperties?: boolean }) {
    if (options && typeof options.allowAdditionalProperties === 'boolean') {
      this.schema.additionalProperties = options.allowAdditionalProperties;
    }
  }

  public addProperty(name: string, type: BasicType, isRequired = false): void {
    this.schema.properties[name] = { type };
    if (isRequired) this.schema.required.push(name);
    try {
      this.ajv.compile(this.schema);
    } catch (err: any) {
      if (err instanceof Error && err.message.includes(`data/properties/${name}/type`)) {
        throw new Error(`${type} is not a valid property type`);
      }
      throw err;
    }
  }

  public generate(): Property {
    return this.schema;
  }
}
