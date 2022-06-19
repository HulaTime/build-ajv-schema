import { FormatName } from 'ajv-formats';

export enum PropertyTypes {
  string = 'string',
  integer = 'integer',
  number = 'number',
  boolean = 'boolean',
  array = 'array',
  object = 'object',
  null = 'null',
}

export type BasicSchemaProperty = {
  type: Omit<PropertyTypes, PropertyTypes.object>;
  format?: FormatName;
}

export type ObjectSchemaProperty = {
  type: PropertyTypes.object;
  properties: ChildObjectProperties;
  required?: string[];
  additionalProperties?: boolean;
}

export type ChildObjectProperties = {
  [key: string]: ObjectSchemaProperty | BasicSchemaProperty;
}

export type ISchema = {
  type: PropertyTypes.object;
  properties: ChildObjectProperties;
  required?: string[];
  additionalProperties?: boolean;
}
