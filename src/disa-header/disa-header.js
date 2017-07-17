class DisaHeader extends Polymer.Element {
  
  static get is() { return 'disa-header'; }

  get properties() {
    return {
      // signedIn: {
      //   type: Boolean,
      //   value: true
      // }
    }
  }

  constructor() {
    super();
    // this.addEventListener('sign-in', (e) => {

    // });

    // this.addEventListener('sign-out', (e) => {
      
    // });
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

window.customElements.define(DisaHeader.is, DisaHeader);
