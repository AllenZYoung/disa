class DisaDashboard extends Polymer.Element {
  
  static get is() { return 'disa-dashboard'; }

  static get properties() {
    return {
      unsortedDraftEntries: {
        type: Array,
        value: []
      },
      unsortedInternalEntries: {
        type: Array,
        value: []
      },
      unsortedPublicEntries: {
        type: Array,
        value: []
      },
      draftEntries: {
        type: Array,
        value: []
      },
      internalEntries: {
        type: Array,
        value: []
      },
      publicEntries: {
        type: Array,
        value: []
      },
      active: {
        type: Boolean
      }
    }
  }

  static get observers() {
    return [
      'activeChanged(active)'
    ]
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  activeChanged(active) {
    if (active && !Utils.isSignedIn()) {
      alert("Please sign in.");
      window.history.pushState({}, null, '/#/');
      window.dispatchEvent(new CustomEvent('location-changed'));
      window.scrollTo(0,0);
      return;
    }
  }
}

window.customElements.define(DisaDashboard.is, DisaDashboard);
