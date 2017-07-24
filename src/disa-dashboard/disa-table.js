class DisaTable extends Polymer.Element {
  
  static get is() { return 'disa-table'; }

  get properties() {
    return {
      unsortedEntries: {
        type: Array
      },
      entries: {
        type: Array
      }
    }
  }

  static get observers() {
    return [
      '__entriesChanged(entries)'
    ]
  }

  __entriesChanged(entries) {
    if (!entries) {
      return;
    }
    if (!this.runOnce) {
      this.set('runOnce', true);
      return;
    }
    if (this.docDateSortDir != 0) {
      this.set('runOnce', false);
      this.set('entries', entries.slice().sort((l,r) => {
        if (l.document.date.year > r.document.date.year) {
          return this.docDateSortDir;
        } else if (l.document.date.year < r.document.date.year) {
          return -this.docDateSortDir;
        } else {
          if (l.document.date.month > r.document.date.month) {
            return this.docDateSortDir;
          } else if (l.document.date.month < r.document.date.month) {
            return -this.docDateSortDir;
          } else {
            if (l.document.date.day > r.document.date.day) {
              return this.docDateSortDir;
            } else if (l.document.date.day < r.document.date.day) {
              return -this.docDateSortDir;
            } else {
              return 0;
            }
          }
        }
      }));
    }
  }

  constructor() {
    super();
    // this.set('title', "con");
    this.set('docDateSortDir', 1);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _toLocaleString(date) {
    return date && new Date(date).toLocaleString();
  }

  __documentDate(date) {
    return date && (date.year && date.year + ' ' || '') + (date.month && this.monthToString(date.month) && this.monthToString(date.month) + ' ' || '') + (date.day && date.day || '') || '';
  }

  monthToString(monthNum) {
    switch (monthNum) {
      case 1:
        return "January"
      case 2:
        return "Feburary";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return null;
    }
  }

  docDateSortFunc(e) {
    this.set('entries', this.entries.slice().sort((l,r) => {
      if (l.document.date.year > r.document.date.year) {
        return this.docDateSortDir;
       } else if (l.document.date.year < r.document.date.year) {
        return -this.docDateSortDir;
       } else {
         if (l.document.date.month > r.document.date.month) {
          return this.docDateSortDir;
        } else if (l.document.date.month < r.document.date.month) {
          return -this.docDateSortDir;
        } else {
          if (l.document.date.day > r.document.date.day) {
            return this.docDateSortDir;
          } else if (l.document.date.day < r.document.date.day) {
            return -this.docDateSortDir;
          } else {
            return 0;
          }
        }
       }
    }));
    for (let entry of this.entries) {
      console.log(entry.document.date.year); 
    }
    switch (this.docDateSortDir) {
      case 1:
        this.docDateSortDir = -1;
        break;
      case 0:
        this.docDateSortDir = 1;
        console.log(this.unsortedEntries);
        this.set('entries', this.unsortedEntries);
        break;
      case -1:
        this.docDateSortDir = 0;
        break;
      default:
        break;
    }
    
  }
}

window.customElements.define(DisaTable.is, DisaTable);
