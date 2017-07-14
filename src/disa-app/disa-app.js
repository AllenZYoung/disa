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
      unsortedDraftEntries: Array,
      __draftEntriesLoaded: Boolean,
      unsortedInternalEntries: Array,
      __internalEntriesLoaded: Boolean,
      unsortedPublicEntries: Array,
      __publicEntriesLoaded: Boolean,
      session: {
        type: String,
        default: "inital"
      }
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

  helloName() {
    return localStorage.getItem("givenName");
  }

  optionsDeArray(arr) {
    if (!this.options) {
      this.set('options', arr[0]);
    }
    // console.log(arr[0]);
    // return arr[0];
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('reload-needed', (e) => {
      console.log("reloading");
      this.__draftEntriesLoaded = false;
      this.__internalEntriesLoaded = false;
      this.__publicEntriesLoaded = false;
      this.set('session', {
        "session" : sessionStorage.getItem('jsession'),
        "id": localStorage.getItem("id")
      });
      this.$.draft.generateRequest();
      this.$.internal.generateRequest();
      this.$.public.generateRequest();
    });
  }

  locationChanged(route) {
    console.log(route);
    console.log(this.route.path);

    // initial load
    if (route == "") {
      this.set('route.path', "/");
      return;
    } else {
      if (route == "/") {
        if (sessionStorage.getItem("jsession")) {
          this.set('route.path', "/dashboard");
        }
      }
      // get the correct user's drafts
      if (this.route.path == '/dashboard') {
        this.dispatchEvent(new CustomEvent("reload-needed", {
          bubbles: true,
          composed: true
        }));
      }
    }

    
    // check

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
    console.log("drafting");
    if (!entries) {
      console.log("intial load");
      return;
    }
    if (entries instanceof Array) {
      if (!this.__draftEntriesLoaded) {
        this.set('unsortedDraftEntries', this.draftEntries);
      }
      this.__draftEntriesLoaded = true;
    } else {
      if (entries.refresh) {
        alert("Please re-signin");
        localStorage.clear();
        sessionStorage.clear();
        window.history.pushState({}, null, '/#/');
        window.dispatchEvent(new CustomEvent('location-changed'));
        window.scrollTo(0,0);
      } else {
        console.log(entries.error);
      }
    }
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


function onSignIn(googleUser) {
  console.log("signed in");
  var id_token = googleUser.getAuthResponse().id_token;
  // haven't already logged in
  if (!sessionStorage.getItem("jsession")) {
    console.log("calling new token");
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://disa-api/newtoken');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      console.log("nt response");
      let response = JSON.parse(xhr.responseText);
      // console.log(response);
      localStorage.setItem("givenName", response.givenName);
      localStorage.setItem("name", response.name);
      localStorage.setItem("status", response.status);
      localStorage.setItem("id", response.id);
      sessionStorage.setItem('jsession', response.session);

      window.history.pushState({}, null, '/#/');
      window.dispatchEvent(new CustomEvent('location-changed'));
      window.history.pushState({}, null, '/#/dashboard');
      window.dispatchEvent(new CustomEvent('location-changed'));
      window.scrollTo(0,0);
    }
    xhr.send('idtoken=' + id_token);
  } else {
    window.history.pushState({}, null, '/#/');
    window.dispatchEvent(new CustomEvent('location-changed'));
    window.history.pushState({}, null, '/#/dashboard');
    window.dispatchEvent(new CustomEvent('location-changed'));
    window.scrollTo(0,0);
  }
}
