class OptionsModal extends Polymer.Element {
  
  static get is() { return 'options-modal'; }

  get properties() {
    return {
      options: {
        type: Array
      },
      editOptions: {
        type: Array
      }
    }
  }

  constructor() {
    super();

    this.addEventListener('iron-overlay-closed', (e) => {
      e.preventDefault();
      this.close(e);
    });
  }

  connectedCallback() {
    super.connectedCallback();
  }

  open() {
    this.$.modal.open();
  }

  close(e) {
    if (this.$.modal.closingReason.confirmed) {
      this.saveOptions();
    } else {
      this.cancelOptions();
    }
  }

  saveOptions() {
    this.dispatchEvent( 
      new CustomEvent('save-options', {
        bubble: true,
        composed: true,
        detail: {
          options: this.editOptions,
          key: this.name
        }
      })
    );
  }

  cancelOptions() {
    let options = [];
    Utils.cloneArray(options, this.options);
    this.set('editOptions', options);
  }

  addOption() {
    let newOptions = [];
    Utils.cloneArray(newOptions, this.editOptions);
    newOptions.push('');
    this.set('editOptions', newOptions);
  }

  removeOption(e) {
    let index = e.path[0].dataIndex;
    let newOptions = [];
    Utils.cloneArray(newOptions, this.editOptions);
    newOptions.splice(index, 1);
    this.set('editOptions', newOptions);
  }
}

window.customElements.define(OptionsModal.is, OptionsModal);
