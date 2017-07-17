class DisaTable extends Polymer.Element {
  
  static get is() { return 'disa-table'; }

  get properties() {
    return {
      unsortedEntries: {
        type: Array,
        value: []
      },
      entries: {
        type: Array,
        value: []
      }
    }
  }

  constructor() {
    super();
    // this.set('title', "con");
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _toLocaleString(date) {
    return date && new Date(date).toLocaleString();
  }
}

window.customElements.define(DisaTable.is, DisaTable);
