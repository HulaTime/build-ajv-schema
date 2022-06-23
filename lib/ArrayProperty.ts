import BasicProperty from './BasicProperty';
import ObjectProperty from './ObjectProperty';

export default class ArrayProperty {
  items: Array<BasicProperty | ObjectProperty | ArrayProperty> = [];

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  addItem(property: BasicProperty | ObjectProperty | ArrayProperty): ArrayProperty {
    this.items.push(property);
    return this;
  }
}
