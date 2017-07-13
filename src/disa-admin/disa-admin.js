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
      editKey: Object
    };
  }

  static get observers() {
    return [
      'editKeyChanged(editKey)'
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
      this.oldOptions = {};
      this.cloneFunc(this.oldOptions, this.getEditOptions());
    });

    this.addEventListener('save-options', (e) => {
      this.set('opened', false);
      let newOptions = {};
      this.cloneFunc(newOptions, this.options);
      this.cloneFunc(newOptions[this.editKey], this.editOptions);
      this.set('options', newOptions);
    });

    this.addEventListener('cancel-options', (e) => {
      // this.set('options')
    });
  }

  editKeyChanged(key) {
    this.editOptions = this.options[key];
  }

  getEditOptions() {
    return this.editOptions;
  }
}

window.customElements.define(DisaAdmin.is, DisaAdmin);
