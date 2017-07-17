class PersonEdit extends Polymer.Element {
  
  static get is() { return 'person-edit'; }

  static get properties() {
    return {
      person: {
        type: Object
      }
    };
  }

  static get observers() {
    return [
    ]
  }

  constructor() {
    super();
  }
  
  connectedCallback() {
    super.connectedCallback();
  }

  __getOptions(key, options) {
    return Utils.__getOptions(key, options);
  }

  __indexOf(value, key, options) {
    return Utils.__indexOf(value, key, options);
  }

  addName() {
    let newNames = [];
    Utils.cloneArray(newNames, this.person.names);
    newNames.push(new PersonName());
    this.set('person.names', newNames);
  }

  removeName(e) {
    let index = e.path[0].dataIndex;
    let newNames = [];
    Utils.cloneArray(newNames, this.person.names);
    newNames.splice(index, 1);
    this.set('person.names', newNames);
  }

  createFromData(formData) {
    let person = new Person();
    
    let firstNames = formData['firstName[]'];
    firstNames = Utils.makeArray(firstNames);
    let lastNames = formData['lastName[]'];
    lastNames = Utils.makeArray(lastNames);
    let nameTypes = formData['nameType[]'];
    nameTypes = Utils.makeArray(nameTypes);
    // hope that they don't have different lengths
    // they shouldn't but you never know what might happen
    let names = [];
    for (let i = 0; i < firstNames.length; ++i) {
      let personName = new PersonName();
      personName.firstName = firstNames[i];
      personName.lastName = lastNames[i];
      personName.type = nameTypes[i];
      names.push(personName);
    }
    person.names = names;

    let tribe = formData['tribe'];
    person.tribe = tribe;

    let origin = formData['origin'];
    person.origin = origin;

    let race = formData['race'];
    person.race = race;

    let sex = formData['sex'];
    person.sex = sex;

    let age = formData['age'];
    person.age = age;

    let vocation = formData['vocation'];
    person.vocation = vocation;

    return person;
  }
}

window.customElements.define(PersonEdit.is, PersonEdit);
