class DisaAdmin extends Polymer.Element {
  
  static get is() { return 'disa-admin'; }

  static get properties() {
    return {
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
    let self = this;
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
    } else if (active && !Utils.isAdmin()) {
      alert("You are not an admin.");
      window.history.pushState({}, null, '/#/dashboard');
      window.dispatchEvent(new CustomEvent('location-changed'));
      window.scrollTo(0,0);
    }
  }

  __key(item) {
    return Utils.__key(item);
  }

  __value(item) {
    return Utils.__value(item);
  }

  __title(item) {
    let key = this.__key(item);
    switch (key) {
      case "nameType":
        return "Name Type";
      case "tribe":
        return "Tribe";
      case "origin":
        return "Origin";
      case "race":
        return "Race";
      case "sex":
        return "Sex";
      case "month":
        return "Month";
      case "status":
        return "Status";
      case "title":
        return "Title";
      case "ownerVocation":
        return "Owner Vocation";
      case "vocation":
        return "Vocation";
      case "typeKindOfEnslavement":
        return "Type/Kind of Enslavement";
      default:
        return key;
    }
  }
}

window.customElements.define(DisaAdmin.is, DisaAdmin);
