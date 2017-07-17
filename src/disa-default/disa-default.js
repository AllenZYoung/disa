class DisaDefault extends Polymer.Element {
  
  static get is() { return 'disa-default'; }

  connectedCallback() {
    super.connectedCallback();
  }
}

window.customElements.define(DisaDefault.is, DisaDefault);
