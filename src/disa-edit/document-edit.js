class DocumentEdit extends Polymer.Element {
  
  static get is() { return 'document-edit'; }

  static get properties() {
    return {
      document: {
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

  __getSortedOptions(key, options, noSort) {
    return noSort ? this.__getOptions(key, options) : Utils.__getSortedOptions(key, options);
  }

  __indexOf(value, key, options) {
    return Utils.__indexOf(value, key, options);
  }

  __monthIndex(month) {
    return Utils.__monthIndex(month);
  }

  createFromData(formData) {
    let document = new Document();

    let date = new TriplePartDate();

    let year = formData['year'];
    let month = formData['month'];
    let day = formData['day'];

    date.year = year;
    date.month = (new Date(`1 ${month} 9999`).getMonth() + 1) || '';
    date.day = day;

    document.date = date;

    let locale = formData['locale'];
    let stringLocation = formData['stringLocation'];
    let colonyState = formData['colonyState'];
    let nationalContext = formData['nationalContext'];
    document.locale = locale;
    document.stringLocation = stringLocation;
    document.colonyState = colonyState;
    document.nationalContext = nationalContext;

    let sourceType = formData['sourceType'];
    let recordType = formData['recordType'];
    let citation = formData['citation'];
    document.sourceType = sourceType;
    document.recordType = recordType;
    document.citation = citation;

    return document;    
  }
}

window.customElements.define(DocumentEdit.is, DocumentEdit);
