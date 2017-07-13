/**
 * @customElement
 * @polymer
 */
class DisaApp extends Polymer.Element {
  
  static get is() { return 'disa-app'; }

  static get properties() {
    return {
      route: Object,
      draftEntries: {
        type: Array
      },
      internalEntries: {
        type: Array
      },
      publicEntries: {
        type: Array
      },
      __editEntry: {
        type: Object
      },
      tableActive: Boolean,
      adminActive: Boolean,
      options: {
        type: Object
      },
      optionsArray: Object,
      reloadValue: {
        type: Object,
        value: {"reload":1}
      },
      unsortedDraftEntries: Array,
      __draftEntriesLoaded: Boolean,
      unsortedInternalEntries: Array,
      __internalEntriesLoaded: Boolean,
      unsortedPublicEntries: Array,
      __publicEntriesLoaded: Boolean
    };
  }

  static get observers() {
    return [
      'optionsDeArray(optionsArray)',
      'locationChanged(route.path)',
      'draftEntriesLoaded(draftEntries)',
      'internalEntriesLoaded(internalEntries)',
      'publicEntriesLoaded(publicEntries)'
    ]
  }

  optionsDeArray(arr) {
    if (!this.options) {
      this.options = arr[0];
    }
  }

  connectedCallback() {
    super.connectedCallback();

    // if the path is undefined or empty, then the user is
    // trying to access '/'. Redirect them to the dashboard.
    if (!this.route.path) {
      this.set('route.path', '/dashboard')
    }

    this.addEventListener('reload-needed', (e) => {
      this.__draftEntriesLoaded = false;
      this.__internalEntriesLoaded = false;
      this.__publicEntriesLoaded = false;
      this.$.draft.generateRequest();
      this.$.internal.generateRequest();
      this.$.public.generateRequest();
    });
  }

  locationChanged(route) {
    // root path redirects to dashboard
    if (this.route.path == '/') {
      this.set('route.path', '/dashboard')
    }

    // console.log('here');
    // // we need to first make sure that the entries have loaded
    // console.log(route);
    // console.log(this.tableActive);
    // let entryId = this.data.page;
    // console.log(this.data)
    // let entryCategory = entryId.substring(5,7);
    // let entryIdentifer = entryId.substring(8);
    // console.log(this.draftEntries);
    // this.__editEntry = this.draftEntries.find(entry => entry.meta.category == entryCategory && entry.meta.identifer == entryIdentifer);
  }

  draftEntriesLoaded(entries) {
    if (!this.__draftEntriesLoaded) {
      this.set('unsortedDraftEntries', this.draftEntries);
    }
    this.__draftEntriesLoaded = true;
  }

  internalEntriesLoaded(entries) {
    if (!this.__internalEntriesLoaded) {
      this.set('unsortedInternalEntries', this.internalEntries);
    }
    this.__internalEntriesLoaded = true;
  }

  publicEntriesLoaded(entries) {
    if (!this.__publicEntriesLoaded) {
      this.set('unsortedPublicEntries', this.publicEntries);
    }
    this.__publicEntriesLoaded = true;
  }
}

window.customElements.define(DisaApp.is, DisaApp);
