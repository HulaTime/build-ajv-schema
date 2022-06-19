import BasicProperty from './BasicProperty';
import { PropertyTypes } from './types';

export interface IObjectProperty  {
  name: string;
  isRequired: boolean;
  type: PropertyTypes.object;
  childProperties: Array<BasicProperty | ObjectProperty>;
  additionalProperties: boolean;
}

export default class ObjectProperty implements IObjectProperty {
  name: string;

  type: PropertyTypes.object;

  isRequired: boolean;

  childProperties: Array<BasicProperty | ObjectProperty>;

  additionalProperties;

  constructor(name: string, isRequired = false) {
    this.name = name;
    this.isRequired = isRequired;
    this.type = PropertyTypes.object;
    this.childProperties = [];
    this.additionalProperties = false;
  }

  private enforceType(type: PropertyTypes): void {
    if (this.type !== type) {
      throw new Error(`Property type must be ${type}`);
    }
  }

  addProperty(property: BasicProperty | ObjectProperty): ObjectProperty {
    this.enforceType(PropertyTypes.object);
    this.childProperties?.push(property);
    return this;
  }

  allowAdditionalProperties(areAllowed = true): ObjectProperty {
    this.enforceType(PropertyTypes.object);
    this.additionalProperties = areAllowed;
    return this;
  }
}
