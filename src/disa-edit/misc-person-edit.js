class MiscPersonEdit extends Polymer.Element {
  
  static get is() { return 'misc-person-edit'; }

  static get properties() {
    return {
      owner: {
        type: Object
      }
    };
  }

  static get observers() {
    return [
    ]
  }

  constructor() {
    super();
  }
  
  connectedCallback() {
    super.connectedCallback();
  }

  __getOptions(key, options) {
    return Utils.__getOptions(key, options);
  }

  __indexOf(value, key, options) {
    return Utils.__indexOf(value, key, options);
  }

  __monthIndex(month) {
    return Utils.__monthIndex(month);
  }

  createFromData(formData) {
    let dateOfRunaway = new TriplePartDate();

    let dateOfRunawayYear = formData['dateOfRunawayYear'];
    let dateOfRunawayMonth = formData['dateOfRunawayMonth'];
    let dateOfRunawayDay = formData['dateOfRunawayDay'];

    dateOfRunaway.year = dateOfRunawayYear;
    dateOfRunaway.month = (new Date(`1 ${dateOfRunawayMonth} 9999`).getMonth() + 1) || '';
    dateOfRunaway.day = dateOfRunawayDay;

    let dateOfEmancipation = new TriplePartDate();

    let dateOfEmancipationYear = formData['dateOfEmancipationYear'];
    let dateOfEmancipationMonth = formData['dateOfEmancipationMonth'];
    let dateOfEmancipationDay = formData['dateOfEmancipationDay'];

    dateOfEmancipation.year = dateOfEmancipationYear;
    dateOfEmancipation.month = (new Date(`1 ${dateOfEmancipationMonth} 9999`).getMonth() + 1) || '';
    dateOfEmancipation.day = dateOfEmancipationDay;

    let buyer = new Name();
    let buyerFirstName = formData['buyerFirstName'];
    let buyerLastName = formData['buyerLastName'];
    buyer.firstName = buyerFirstName;
    buyer.lastName = buyerLastName;

    let seller = new Name();
    let sellerFirstName = formData['sellerFirstName'];
    let sellerLastName = formData['sellerLastName'];
    seller.firstName = sellerFirstName;
    seller.lastName = sellerLastName;

    let dateOfSale = new TriplePartDate();

    let dateOfSaleYear = formData['dateOfSaleYear'];
    let dateOfSaleMonth = formData['dateOfSaleMonth'];
    let dateOfSaleDay = formData['dateOfSaleDay'];

    dateOfSale.year = dateOfSaleYear;
    dateOfSale.month = (new Date(`1 ${dateOfSaleMonth} 9999`).getMonth() + 1) || '';
    dateOfSale.day = dateOfSaleDay;

    let dateOfMarriage = new TriplePartDate();

    let dateOfMarriageYear = formData['dateOfMarriageYear'];
    let dateOfMarriageMonth = formData['dateOfMarriageMonth'];
    let dateOfMarriageDay = formData['dateOfMarriageDay'];

    dateOfMarriage.year = dateOfMarriageYear;
    dateOfMarriage.month = (new Date(`1 ${dateOfMarriageMonth} 9999`).getMonth() + 1) || '';
    dateOfMarriage.day = dateOfMarriageDay;

    return [dateOfRunaway, dateOfEmancipation, buyer, seller, dateOfSale, dateOfMarriage];
  }
}

window.customElements.define(MiscPersonEdit.is, MiscPersonEdit);
