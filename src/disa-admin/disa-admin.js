/**
 * @customElement
 * @polymer
 */
class DisaAdmin extends Polymer.Element {
  
  static get is() { return 'disa-admin'; }

  static get properties() {
    return {
      opened: Boolean,
      options: Object,
      editKey: Object,
      // editOptions: Array
    };
  }

  static get observers() {
    return [
      'editKeyChanged(editKey)',
      '__optionsChanged(options)'
    ]
  }

  cloneFunc(clone, obj) {
    for(var i in obj)
      clone[i] = (typeof obj[i] == "object") && obj[i] !== null ? this.cloneFunc(obj[i].constructor(), obj[i]) : obj[i];
    return clone;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('modal-opened', (e) => {
      this.set('opened', true);
      this.set('editKey', e.detail.key);
      // this.set('editOptions', this.options[e.detail.key]);
    });

    this.addEventListener('save-options', (e) => {
      this.set('opened', false);
      let newSubOptions = [];

      this.cloneArray(newSubOptions, e.detail.options);
      let newFullOptions = [];
      this.cloneFunc(newFullOptions, this.options);
      newFullOptions[this.editKey] = newSubOptions;
      this.set('options', newFullOptions);
      console.log(this.options);
      this.set('editOptions', this.options[this.editKey]);
    });

    this.addEventListener('cancel-options', (e) => {
      // console.log("cancel main options", this.options[this.editKey]);
      // this.set('editOptions', this.options[this.editKey]);
      // console.log(this.editOptions);
      this.set('opened', false);
    });
  }

  __optionsChanged(options) {
    this.set('raceOptions', options.race);
    console.log(this.raceOptions, options.race);
  }

  getOptions(options, key) {
    return options[key];
  }

  editKeyChanged(key) {
    let oldOptions = [];
    this.cloneArray(oldOptions, this.options[key]);
    this.set('editOptions', oldOptions);
    // console.log("editKey");
    // console.log(this.editOptions);
    // let oldOptions = {};
    // this.cloneFunc(oldOptions, this.editOptions);
    // this.set('oldOptions', oldOptions);
  }

  // editOptions(options, key) {
  //   let oldOptions = [];
  //   this.cloneArray(oldOptions, options && options[key] || []);
  //   this.set('editOptions', oldOptions);
  //   // let editOptions = this.cloneArray(editOptions, options[key]);
  //   return this.editOptions;
  // }

  cloneArray(newArray, oldArray) {
    for (let i = 0; i < oldArray.length; ++i) {
      newArray[i] = oldArray[i];
    }
  }
}

window.customElements.define(DisaAdmin.is, DisaAdmin);
