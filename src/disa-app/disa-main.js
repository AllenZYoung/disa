class DisaMain extends Polymer.Element {
  
  static get is() { return 'disa-main'; }

  get properties() {
    return {
      options: {
        type: Array
      },
      route: Object,
      draftEntries: Array,
      internalEntries: Array,
      publicEntries: Array
    }
  }

  static get observers() {
    return [
      '__routeChanged(route)',
      '__entriesChanged(draftEntries, internalEntries, publicEntries)'
    ]
  }

  __entriesChanged(draftEntries, internalEntries, publicEntries) {
    // this.set('unsortedDraftEntries', draftEntries);
    // this.set('unsortedInternalEntries', internalEntries);
    // this.set('unsortedPublicEntries', publicEntries);
  }

  constructor() {
    super();
    let self = this;
    
    // defaults
    this.set('apiHost', "http://cole-mint:8080");

    // event listeners
    this.addEventListener('sign-in', function(e) {
      e.preventDefault();
      console.log("local signin");
      self.onSignIn(e.detail.jwt, e.detail.response);
      return false;
    });

    this.addEventListener('sign-out', function(e) {
      e.preventDefault();
      self.onSignOut();
      return false;
    });

    window.t = this;
    this.addEventListener('save-options', function(e) {
      // this check probably won't happen any more, because the entire admin page is behind a similar check
      if (!Utils.isAdmin()) {
        // There is also server-side authentication, so any client side tricks you try to do will be for naught.
        alert("You are not an admin. You cannot edit the options. If you need another choice for the options dropdown, please email Professor Fisher. In the mean time, put the desired information in the researchers' notes field.");
        return;
      }
      let newOptions = e.detail.options;
      console.log(newOptions);
      // TODO: do this after success response
      let clonedOptions = [];
      Utils.cloneArray(clonedOptions, self.options);

      let key = e.detail.key;
      for (let i = 0; i < clonedOptions.length; ++i) {
        if (Utils.__key(clonedOptions[i]) == key) {
          clonedOptions[i][key] = newOptions;
          break;
        }
      }
      console.log(clonedOptions);
      this.set('options', clonedOptions);

      this.set('optionsName', key);
      this.set('newOptions', newOptions);

      this.$.saveOptionsAjax.generateRequest();
    });

    this.addEventListener('reload-needed', function(e) {
      e.preventDefault();
      this.loadEntries();
      return false;
    });
  }

  connectedCallback() {
    super.connectedCallback();

    this.set('signedIn', Utils.isSignedIn());

    let self = this;
    if (this.signedIn) {
      // validate token
      let jwt = localStorage.getItem('jwt');
      Utils.validateToken(this.apiHost + '/signin', jwt, function(validTokenResponse) {
        if (validTokenResponse.error) {
          this.onSignOut();
        } else {
          self.successfulSignin();
          self.startRefresh(validTokenResponse);
          self.loadEntries();
        }
        return;
      });
    } else {
      this.onSignOut();
    }
  }

  draftEntriesReceived(e) {
    let response = e.detail.response;
    if (!response) {
      alert("Oh no! Something terrible went wrong. Stop all work and inform Cole ASAP!");
    } else if (response.error) {
      alert(response.error);
    } else {
      this.set('draftEntries', response);
    }
  }

  internalEntriesReceived(e) {
    let response = e.detail.response;
    if (!response) {
      alert("Oh no! Something terrible went wrong. Stop all work and inform Cole ASAP!");
    } else if (response.error) {
      alert(response.error);
    } else {
      this.set('internalEntries', response);
    }
  }

  publicEntriesReceived(e) {
    let response = e.detail.response;
    if (!response) {
      alert("Oh no! Something terrible went wrong. Stop all work and inform Cole ASAP!");
    } else if (response.error) {
      alert(response.error);
    } else {
      this.set('publicEntries', response);
    }
  }

  __routeChanged(route) {
    if (!Utils.isSignedIn()) {
      this.onSignOut();
      return;
    }
    if (this.isInvalidRoute(route)) {
      this.set('route.path', '/dashboard');
    }
    if (route && (route.path == '/admin' || route.path.startsWith('/edit'))) {
      this.$.getOptionsAjax.generateRequest();
    }
  }

  loadEntries() {
    this.$.getDraftAjax.generateRequest();
    this.$.getInternalAjax.generateRequest();
    this.$.getPublicAjax.generateRequest();
  }

  // BEGIN Auth
  onSignIn(jwt, response) {
    this.set('signedIn', true);
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('role', response.role);
    localStorage.setItem('givenName', response.givenName);
    this.successfulSignin();
    this.startRefresh(response);
    this.loadEntries();
  }

  successfulSignin() {
    this.set('givenName', localStorage.getItem('givenName'));

    this.set('headers', {
      "Authorization": `Bearer ${localStorage.getItem("jwt")}`
    });

    if (this.isInvalidRoute(this.route)) {
      this.set('route.path', '/dashboard');
    }
  }

  startRefresh(response) {
    let initialTimeout = (response.payload.exp * 1000 - new Date()) - (1000 * 60);
    if (initialTimeout < 1000 * 60 * 10000) {
      initialTimeout = 0;
    }
    let self = this;
    window.setTimeout(function() {
      self.refresh = window.setInterval(function() {
        console.log("refreshing");
        let googleUser = gapi && gapi.auth2 && gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().currentUser.get();
        if (!googleUser) {
          console.error("No google");
          return;
        }
        googleUser.reloadAuthResponse()
        self.refreshed(googleUser);
      }, 4000); // * 60 * 55
    }, initialTimeout); 
  }

  refreshed(googleUser) {
    localStorage.setItem('jwt', googleUser.getAuthResponse().id_token);
    this.successfulSignin();
  }

  stopRefresh() {
    this.refresh && window.clearInterval(this.refresh);
  }

  onSignOut() {
    this.set('signedIn', false);
    this.stopRefresh();
    Utils.clearAndSignout();
    this.set('route.path', '/');
  }
  // END auth

  isInvalidRoute(route) {
    return route &&
      route.path !== '/dashboard' &&
      route.path !== '/admin' &&
      !route.path.startsWith('/edit');
  }
}

window.customElements.define(DisaMain.is, DisaMain);

// export the onSignIn method into global space
function onSignIn(googleUser) {
  let id_token = googleUser.getAuthResponse().id_token;
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `http://cole-mint:8080/signin`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    let response = JSON.parse(xhr.responseText);
    if (response.error) {
      alert(response.error);
      return;
    } else {
      document.getElementsByTagName('disa-main')[0].dispatchEvent(
        new CustomEvent('sign-in', {
          bubbles: false,
          detail: {
            jwt: id_token,
            response: response
          }
        })
      );
      return;
    }
  };
  xhr.send('idtoken=' + id_token);
}
