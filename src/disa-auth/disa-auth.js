class DisaAuth extends Polymer.Element {
  
  static get is() { return 'disa-auth'; }

  get properties() {
    // return {
    //   signedIn: {
    //     type: Boolean,
    //     default: true
    //   }
    // }
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  // sign in event handled by google

  onSignOut() {
    this.dispatchEvent(
      new CustomEvent('sign-out', {
        bubbles: true,
        composed: true
      })
    );
  }
}

window.customElements.define(DisaAuth.is, DisaAuth);
