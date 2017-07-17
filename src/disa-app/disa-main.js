class DisaMain extends Polymer.Element {
  
  static get is() { return 'disa-main'; }

  get properties() {
    return {
      options: {
        type: Array
      }
    }
  }

  constructor() {
    super();
    let self = this;
    // defaults
    this.set('signedIn', Utils.isSignedIn());
    this.set('apiHost', "http://cole-mint");

    if (this.signedIn) {
      // check local storage for customization
      // signed in check
      let jwt = localStorage.getItem('jwt');

      this.set('givenName', localStorage.getItem('givenName'));

      this.set('headers', {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      });
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
  }

  // BEGIN Auth
  onSignIn(googleUser) {
    let self = this;
    this.set('signedIn', true);
    let id_token = googleUser.getAuthResponse().id_token;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.apiHost}/tokensignin`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      let response = JSON.parse(xhr.responseText);
      if (response.error) {
        alert("There was an error signing in. Please try again.");
        return;
      }
      // setup refresh mechanism
      window.refresh = window.setInterval(function () {
        googleUser.reloadAuthResponse();
        const jwt = googleUser.getAuthResponse().id_token;
        localStorage.setItem('jwt', jwt);
        self.set('headers', {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        });
      }, (googleUser.getAuthResponse().expires_in - 1800) * 1000);
      localStorage.setItem('jwt', id_token);
      self.set('headers', {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      });
      localStorage.setItem('status', response.status);
      localStorage.setItem('givenName', response.givenName);
      window.history.pushState({}, null, '/#/dashboard');
      window.dispatchEvent(new CustomEvent('location-changed'));
      window.scrollTo(0,0);
    };
    xhr.send('idtoken=' + id_token);
  }

  onSignOut() {
    this.set('signedIn', false);
    window.clearInterval(window.refresh);
    localStorage.clear();
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  // END auth
}

window.customElements.define(DisaMain.is, DisaMain);

// export the onSignIn method into global space
function onSignIn(googleUser) {
  document.getElementsByTagName('disa-main')[0].dispatchEvent(
    new CustomEvent('sign-in', {
      bubbles: false,
      detail: {
        googleUser: googleUser
      }
    })
  );
}
