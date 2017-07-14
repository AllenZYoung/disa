/**
 * @customElement
 * @polymer
 */
class DisaAdmin extends Polymer.Element {
  
  static get is() { return 'disa-admin'; }

  static get properties() {
    return {
      opened: Boolean,
      options: Object,
      editKey: Object,
      users: Array
      // editOptions: Array
    };
  }

  static get observers() {
    return [
      'editKeyChanged(editKey)',
      '__optionsChanged(options)'
    ]
  }

  cloneFunc(clone, obj) {
    for(var i in obj)
      clone[i] = (typeof obj[i] == "object") && obj[i] !== null ? this.cloneFunc(obj[i].constructor(), obj[i]) : obj[i];
    return clone;
  }

  addUser() {
    let self = this;
    let email = this.$.email.value;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://disa-api/users');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      let response = JSON.parse(xhr.responseText);
      console.log(response);
      // localStorage.setItem("givenName", response.givenName);
      // localStorage.setItem("name", response.name);
      // localStorage.setItem("status", response.status);
      // localStorage.setItem("id", response.id);
      // sessionStorage.setItem('jsession', response.session);

      // window.history.pushState({}, null, '/#/');
      // window.dispatchEvent(new CustomEvent('location-changed'));
      // window.history.pushState({}, null, '/#/dashboard');
      // window.dispatchEvent(new CustomEvent('location-changed'));
      // window.scrollTo(0,0);
      if (response.status == 201) {
        self.push('users', {
          email: email
        });
        self.$.email.value = "";
      }
    }
    xhr.send(JSON.stringify({
      "email": email,
      "role": "User"
    }));
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('modal-opened', (e) => {
      this.set('opened', true);
      this.set('editKey', e.detail.key);
      // this.set('editOptions', this.options[e.detail.key]);
    });

    this.addEventListener('save-options', (e) => {
      this.set('opened', false);
      let newSubOptions = [];

      this.cloneArray(newSubOptions, e.detail.options);
      let newFullOptions = {};
      this.cloneFunc(newFullOptions, this.options);
      newFullOptions[this.editKey] = newSubOptions;
      this.set('options', newFullOptions);
      this.set('editOptions', this.options[this.editKey]);
      this.setProperties({
        body: this.options,
        method: 'PUT',
        url: `http://disa-api/options`
      });
    });

    this.addEventListener('cancel-options', (e) => {
      // console.log("cancel main options", this.options[this.editKey]);
      // this.set('editOptions', this.options[this.editKey]);
      // console.log(this.editOptions);
      this.set('opened', false);
    });
  }

  __optionsChanged(options) {
    this.set('raceOptions', options.race);
  }

  getOptions(options, key) {
    return options[key];
  }

  editKeyChanged(key) {
    let oldOptions = [];
    this.cloneArray(oldOptions, this.options[key]);
    this.set('editOptions', oldOptions);
    // console.log("editKey");
    // console.log(this.editOptions);
    // let oldOptions = {};
    // this.cloneFunc(oldOptions, this.editOptions);
    // this.set('oldOptions', oldOptions);
  }

  // editOptions(options, key) {
  //   let oldOptions = [];
  //   this.cloneArray(oldOptions, options && options[key] || []);
  //   this.set('editOptions', oldOptions);
  //   // let editOptions = this.cloneArray(editOptions, options[key]);
  //   return this.editOptions;
  // }

  cloneArray(newArray, oldArray) {
    for (let i = 0; i < oldArray.length; ++i) {
      newArray[i] = oldArray[i];
    }
  }
}

window.customElements.define(DisaAdmin.is, DisaAdmin);
