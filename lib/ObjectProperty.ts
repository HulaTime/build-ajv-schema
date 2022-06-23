import BasicProperty from './BasicProperty';
import { ObjectPropertyTypes } from './types';

export interface IObjectProperty  {
  name: string;
  isRequired: boolean;
  type: ObjectPropertyTypes.object;
  childProperties: Array<BasicProperty | ObjectProperty>;
  additionalProperties: boolean;
}

export default class ObjectProperty implements IObjectProperty {
  name: string;

  type: ObjectPropertyTypes.object;

  isRequired: boolean;

  childProperties: Array<BasicProperty | ObjectProperty>;

  additionalProperties;

  constructor(name: string, isRequired = false) {
    this.name = name;
    this.isRequired = isRequired;
    this.type = ObjectPropertyTypes.object;
    this.childProperties = [];
    this.additionalProperties = false;
  }

  private enforceType(type: ObjectPropertyTypes): void {
    if (this.type !== type) {
      throw new Error(`Property type must be ${type}`);
    }
  }

  addProperty(property: BasicProperty | ObjectProperty): ObjectProperty {
    this.enforceType(ObjectPropertyTypes.object);
    this.childProperties?.push(property);
    return this;
  }

  allowAdditionalProperties(areAllowed = true): ObjectProperty {
    this.enforceType(ObjectPropertyTypes.object);
    this.additionalProperties = areAllowed;
    return this;
  }
}
