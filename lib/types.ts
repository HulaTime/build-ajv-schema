import { FormatName } from 'ajv-formats';

export enum BasicPropertyTypes {
  string = 'string',
  integer = 'integer',
  number = 'number',
  boolean = 'boolean',
  null = 'null',
}

export enum ObjectPropertyTypes {
  array = 'array',
  object = 'object',
}

export type BasicSchemaProperty = {
  type: BasicPropertyTypes;
  format?: FormatName;
}

export type ObjectSchemaProperty = {
  type: ObjectPropertyTypes.object;
  properties: ChildObjectProperties;
  required: string[];
  additionalProperties: boolean;
}

export type ChildObjectProperties = {
  [key: string]: ObjectSchemaProperty | BasicSchemaProperty;
}

export type ISchema = {
  type: ObjectPropertyTypes.object;
  properties: ChildObjectProperties;
  required?: string[];
  additionalProperties?: boolean;
}
