class OwnerEdit extends Polymer.Element {
  
  static get is() { return 'owner-edit'; }

  static get properties() {
    return {
      owner: {
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
    console.log(this.owner);
    Utils.cloneArray(newNames, this.owner.names);
    newNames.push(new OwnerName());
    this.set('owner.names', newNames);
  }

  removeName(e) {
    let index = e.path[0].dataIndex;
    let newNames = [];
    Utils.cloneArray(newNames, this.owner.names);
    newNames.splice(index, 1);
    this.set('owner.names', newNames);
  }

  createFromData(formData) {
    let owner = new Owner();
    

    let titles = formData['title'];
    let firstNames = formData['ownerFirstName'];
    let lastNames = formData['ownerLastName'];

    let name = new OwnerName();
    name.type = titles;
    name.firstName = firstNames;
    name.lastName = lastNames;
    owner.name = name;

    let vocation = formData['ownerVocation'];
    owner.vocation = vocation;

    return owner;
  }
}

window.customElements.define(OwnerEdit.is, OwnerEdit);
