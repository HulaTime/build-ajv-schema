import { BasicPropertyTypes } from './types';

export interface IBasicProperty {
  name: string;
  type: BasicPropertyTypes;
  isRequired: boolean;
}

export default class BasicProperty implements IBasicProperty {
  name;

  type;

  isRequired;

  constructor(name: string, type: BasicPropertyTypes, isRequired = false) {
    this.name = name;
    this.type = type;
    this.isRequired = isRequired;
  }
}
