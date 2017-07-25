class DisaMain extends Polymer.Element {
  
  static get is() { return 'disa-main'; }

  get properties() {
    return {
      options: {
        type: Array
      },
      route: Object
    }
  }

  static get observers() {
    return [
      '__routeChanged(route)',
      '__entriesChanged(draftEntries, internalEntries, publicEntries)'
    ]
  }

  __entriesChanged(draft, internal, publicEntries) {
    this.set('unsortedDraftEntries', draft);
    this.set('unsortedInternalEntries', internal);
    this.set('unsortedPublicEntries', publicEntries);
  }

  constructor() {
    super();
    console.log("constructor");
    let self = this;

    // let googleUser = gapi && gapi.auth2 && gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().currentUser.get();
    // if (googleUser) {
    //   googleUser.reloadAuthResponse();
    // }
    // if (googleUser && googleUser.Zi && googleUser.Zi.id_token) {
    //   localStorage.setItem('jwt', googleUser.Zi.id_token);
    //   self.set('headers', {
    //     "Authorization": `Bearer ${localStorage.getItem("jwt")}`
    //   });
    // }
    
    // defaults
    this.set('signedIn', Utils.isSignedIn());
    this.set('apiHost', "http://api.disa.forkinthecode.com");

    if (this.signedIn) {
      // check local storage for customization
      // signed in check
      let jwt = localStorage.getItem('jwt');

      this.set('givenName', localStorage.getItem('givenName'));

      this.set('headers', {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      });

      if (window.location.hash == "" || window.location.hash == "#" || window.location.hash == "#/") {
        this.set('route.path', '/dashboard');
      }
    } else {
      let auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }

    // event listeners
    this.addEventListener('sign-in', function(e) {
      e.preventDefault();
      self.onSignIn(e.detail.googleUser);
      return false;
    });

    this.addEventListener('refresh', function(e) {
      e.preventDefault();
      self.refresh(e.detail.googleUser);
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
      this.$.getDraftAjax.generateRequest();
      this.$.getInternalAjax.generateRequest();
      this.$.getPublicAjax.generateRequest();
      return false;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    // // this.setAttribute('active', true);
    // console.log("cc");
    // this.setAttribute('active', true);
    
  }

  __routeChanged(route) {
    if (this.signedIn && route && (route.path == '' || route.path == '/')) {
      this.set('route.path', '/dashboard');
    }
    if (route && (route.path == '/admin' ||  route.path.startsWith('/edit'))) {
      this.$.getOptionsAjax.generateRequest();
    }
  }

  // BEGIN Auth
  onSignIn(googleUser) {
    this.set('signedIn', true);
    this.refresh(googleUser);
  }

  onSignOut() {
    this.set('signedIn', false);
    // window.clearInterval(window.refresh);
    localStorage.clear();
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  refresh(googleUser) {
    try {
      googleUser.reloadAuthResponse();
      const jwt = googleUser.getAuthResponse().id_token;
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `http://api.disa.forkinthecode.com/tokensignin`);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function() {
        let response = JSON.parse(xhr.responseText);
        if (response.error) {
          return;
        }
        
        localStorage.setItem('status', response.status);
        localStorage.setItem('givenName', response.givenName);
      };
      xhr.send('idtoken=' + jwt);
      if (!jwt) return;
      localStorage.setItem('jwt', jwt);
      this.set('headers', {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      });

      this.set('signedIn', Utils.isSignedIn());

      if (Utils.isSignedIn() && (this.route.path == '' || this.route.path == '/')) {
        this.set('route.path', '/dashboard');
      }
    } catch (e) {
      return;
    }
  }
  // END auth
}

window.customElements.define(DisaMain.is, DisaMain);

// export the onSignIn method into global space
function onSignIn(googleUser) {
  console.log("global sign in");
  let id_token = googleUser.getAuthResponse().id_token;
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `http://api.disa.forkinthecode.com/tokensignin`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    let response = JSON.parse(xhr.responseText);
    if (response.error) {
      alert("There was an error signing in. Please try again.");
      return;
    }
    
    localStorage.setItem('status', response.status);
    localStorage.setItem('givenName', response.givenName);

    document.getElementsByTagName('disa-main')[0].dispatchEvent(
      new CustomEvent('sign-in', {
        bubbles: false,
        detail: {
          googleUser: googleUser
        }
      })
    );

    window.history.pushState({}, null, '/#/dashboard');
    window.dispatchEvent(new CustomEvent('location-changed'));
    window.scrollTo(0,0);
  };
  xhr.send('idtoken=' + id_token);
}

window.refresh = window.setInterval(function () {
  let googleUser = gapi && gapi.auth2 && gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().currentUser.get();
  if (!googleUser) return;
  document.getElementsByTagName('disa-main')[0].dispatchEvent(
    new CustomEvent('refresh', {
      bubbles: false,
      detail: {
        googleUser: googleUser
      }
    })
  );
}, (10) * 1000);
