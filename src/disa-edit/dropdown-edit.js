class DropdownEdit extends Polymer.Element {
  
  static get is() { return 'dropdown-edit'; }

  static get properties() {
    return {
      value: {
        type: String,
        notify: true
      },
      selectedItem: Object,
      key: String,
      item: Object,
      label: String,
      options: {
        type: Array,
        notify: true
      }
    };
  }

  static get observers() {
    return [
      'selectedItemChanged(selectedItem)',
      'valueChanged(value)'
    ]
  }

  constructor() {
    super();
    this.dropdown = true;
  }

  ready() {
    super.ready();
  }
  
  connectedCallback() {
    super.connectedCallback();
  }

  selectedItemChanged(selectedItem) {
    if (this.valueGuard) {
      this.valueGuard = false;
      return;
    }
    if (selectedItem) {
      this.set('value', selectedItem.value || '');
    }
  }

  valueChanged(value) {
    if (!this.dropdown) {
      let options = this.options;
      for (let i = 0; i < options.length; ++i) {
        if (options[i][this.key]) {
          options[i][this.key].pop();
          options[i][this.key].push(value);
          break;
        }
      }
      this.set('options', options);
      this.valueGuard = true;
    }
  }

  __isAdmin() {
    return Utils.isAdmin();
  }

  resetDropdown() {
    this.dropdown = true;
    let x = this.shadowRoot.querySelectorAll(".start");
    this.shadowRoot.querySelectorAll(".start").forEach((e) => {
      if (e.innerText.toLowerCase() !== "add option") {
        e.innerText = e.innerText.toLowerCase() === "add option" ? "Dropdown" : "Add Option";
        e.parentElement.children[0].classList.toggle("hidden");
        e.parentElement.children[1].classList.toggle("hidden");
        e.parentElement.children[4].classList.toggle("hidden");
      }
    }, this);
  }

  __addOption(e) {
    if (!Utils.isAdmin()) {
      alert("You are not an admin. You cannot add new options.");
    } else {
      e.path[0].innerText = e.path[0].innerText.toLowerCase() === "add option" ? "Dropdown" : "Add Option";
      e.path[1].children[0].classList.toggle("hidden");
      e.path[1].children[1].classList.toggle("hidden");
      e.path[1].children[4].classList.toggle("hidden");
      this.dropdown = !this.dropdown;
      if (!this.dropdown) {
        let options = this.options;
        for (let i = 0; i < options.length; ++i) {
          if (options[i][this.key]) {
            options[i][this.key].push(this.value || '');
            break;
          }
        }
        this.set('options', options);
      } else {
        let options = this.options;
        for (let i = 0; i < options.length; ++i) {
          if (options[i][this.key]) {
            options[i][this.key].pop();
            break;
          }
        }
        this.set('options', options);
      }
    }
  }

  __getOptions(key, options) {
    return Utils.__getOptions(key, options);
  }

  __getSortedOptions(key, options) {
    return Utils.__getSortedOptions(key, options);
  }

  __indexOf(value, key, options) {
    return this.__getSortedOptions(key, options).indexOf(value);
  }
}

window.customElements.define(DropdownEdit.is, DropdownEdit);
