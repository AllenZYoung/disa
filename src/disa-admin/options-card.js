class OptionsCard extends Polymer.Element {
  
  static get is() { return 'options-card'; }

  get properties() {
    return {
      options: {
        type: Array
      }
    }
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  openModal() {
    console.log("opening");
    this.$.modal.open();
  }

  saveOptions() {

  }

  cancelOptions() {

  }

  addOption() {

  }

  removeOption() {

  }
}

window.customElements.define(OptionsCard.is, OptionsCard);
