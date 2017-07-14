/**
 * @customElement
 * @polymer
 */
class DisaEdit extends Polymer.Element {
  
  static get is() { return 'disa-edit'; }

  static get properties() {
    return {
      entry: {
        type: Object,
        value: {}
      },
      entryId: String,
      userId: Object,
      options: {
        type: Object
      },
      __entryLoaded: Boolean,
      method: String,
      url: String,
      body: Object,
      saveResponse: Object
    };
  }

  static get observers() {
    return [
      '__entryLoad(entry)',
      '__saveResponse(saveResponse)'
    ]
  }

  __entryLoad(entry) {
    // this is such an ugly hack!!!
    // I hate it, but it doesn't work without it
    this.shadowRoot.querySelector("iron-form").children[0].querySelectorAll("paper-input").forEach((elem) => elem.shadowRoot.querySelector("paper-input-container").children.input.dispatchEvent(new CustomEvent("blur",{bubbles:true,composed:true})));
    this.$.ai.shadowRoot.children[1].children.input.shadowRoot.querySelector("textarea").dispatchEvent(new CustomEvent("bind-value-changed", {bubbles:true, composed:true}));
    this.$.rn.shadowRoot.children[1].children.input.shadowRoot.querySelector("textarea").dispatchEvent(new CustomEvent("bind-value-changed", {bubbles:true, composed:true}));
    this.$.ai.shadowRoot.children[1].children.input.shadowRoot.querySelector("textarea").dispatchEvent(new CustomEvent("blur", {bubbles:true, composed:true}));
    this.$.rn.shadowRoot.children[1].children.input.shadowRoot.querySelector("textarea").dispatchEvent(new CustomEvent("blur", {bubbles:true, composed:true}));
  }

  returnToDashboard() {
    this.dispatchEvent(new CustomEvent('reload-needed', {
      bubbles: true,
      composed: true
    }));
    window.history.pushState({}, null, '/#/dashboard');
    window.dispatchEvent(new CustomEvent('location-changed'));
    window.scrollTo(0,0);
  }

  __saveResponse(saveResponse) {
    this.$.spinnerContainer.style.display = "none";
    this.$.saveSpinner.active = false;
    this.$.saveSpinner.hidden = true;
    this.$.form.disabled = false;
    if (saveResponse && (saveResponse.status == 200 || saveResponse.status == 201)) {
      this.$.form.reset();
      this.set('entryId', undefined);
      this.returnToDashboard();
    } else {
      alert("There was an error. Please try again.");
    }
  }

  addName() {
    if (!this.entry) {
      this.set('entry', {});
    }
    if (!this.entry.names) {
      this.set('entry.names', []);
    }
    this.push('entry.names', {
      firstName: '',
      lastName: '',
      type: ''
    });
  }

  addOwnerName() {
    if (!this.entry) {
      this.set('entry', {});
    }
    if (!this.entry.ownerNames) {
      this.set('entry.ownerNames', []);
    }
    this.push('entry.ownerNames', {
      firstName: '',
      lastName: '',
      type: ''
    });
  }

  addChildName() {
    if (!this.entry) {
      this.set('entry', {});
    }
    if (!this.entry.childrenNames) {
      this.set('entry.childrenNames', []);
    }
    this.push('entry.childrenNames', {
      firstName: '',
      lastName: '',
      type: ''
    });
  }

  connectedCallback() {
    super.connectedCallback();

    this.$.saveBtn.addEventListener('click', (e) => {
      this.newStage = "Draft";
      this.submitForm();
    });

    this.$.releaseToTeamBtn.addEventListener('click', (e) => {
      this.newStage = "Internal";
      this.submitForm();
    });

    this.$.cancelBtn.addEventListener('click', (e) => {
      this.cancel();
    });

    this.$.addNameBtn.addEventListener('click', (e) => {
      this.addName();
    });

    this.$.addOwnerNameBtn.addEventListener('click', (e) => {
      this.addOwnerName();
    });


    this.$.addChildNameBtn.addEventListener('click', (e) => {
      this.addChildName();
    });

    this.addEventListener('click', (e) => {
      window.e = e.path[0];
      switch (e.path[0].getAttribute("class")) {
        case 'removeNameBtn':
          this.splice('entry.names', e.path[0].dataIndex, 1);
          break;
        case 'removeOwnerNameBtn':
          this.splice('entry.ownerNames', e.path[0].dataIndex, 1);
          break;
        case 'removeChildNameBtn':
          this.splice('entry.childrenNames', e.path[0].dataIndex, 1);
          break;
        default:
          break;
      }
    });

    let self = this;
    this.$.form.addEventListener('iron-form-presubmit', function(e) {
      e.preventDefault();
      let body = new Person(this.request.params);
      body.meta = self.entry && self.entry.meta || {};
      body.meta.lastModified = new Date();
      body.meta.updatedBy = this.userId;
      body.meta.stage = self.newStage;
      body.meta.creator = body.meta.creator || localStorage.getItem("id");
      if (self.entryId != 'new') {
        body._id = self.entryId;
      }
      self.setProperties({
        body: body,
        method: self.entryId == 'new' ? 'POST' : 'PUT',
        url: `http://disa.disa-api/entries`
      });
      // reset the id to clear out the two-way data binding on the names
      // self.set('entryId', undefined);
      return false;
    });
  }

  _toLocaleString(date) {
    return date && new Date(date).toLocaleString();
  }

  __entryUrl(entryId) {
    if (!entryId || entryId == 'new') {
      this.set('entry', {});
      return '';
    }
    return `http://disa.disa-api/entries/${entryId}`;
  }

  __header(entryId, entry) {
    if (entryId == 'new') {
      return 'New Person';
    } else {
      return `This is DISA-${this.entry && this.entry.meta && this.entry.meta.category || ''}-${this.entry && this.entry.meta && this.entry.meta.identifier || ''}`;
    }
  }

  cancel() {
    this.$.form.reset();
    this.set('entryId', undefined);
    this.returnToDashboard();
  }

  submitForm() {
    this.$.spinnerContainer.style.display = "block";
    this.$.saveSpinner.active = true;
    this.$.saveSpinner.hidden = false;
    this.$.form.disabled = true;
    this.$.form.submit();
  }

  indexOf(item, list) {
    let strItem = this.monthToString(item);
    return list && list.indexOf(strItem);
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

}

window.customElements.define(DisaEdit.is, DisaEdit);

class Person {
  constructor(formData) {
    this.names = new Names(formData['firstName[]'], formData['lastName[]'], formData['type[]']).names;
    this.tribe = formData.tribe;
    this.origin = formData.origin;
    this.race = formData.race;
    this.sex = formData.sex;
    this.age = formData.age;
    this.typeKindOfEnslavement = formData.typeKindOfEnslavement;
    this.vocation = formData.vocation;
    this.stringLocation = formData.stringLocation;
    this.colonyState = formData.colonyState;
    this.nationalContext = formData.nationalContext;
    this.ownerNames = new OwnerNames(formData['ownerTitle[]'], formData['ownerFirstName[]'], formData['ownerLastName[]']).names;
    this.ownerVocation = formData.ownerVocation;
    this.dateOfRunaway = new TriplePartDate(formData.dateOfRunawayYear, formData.dateOfRunawayMonth, formData.dateOfRunawayDay);
    this.dateOfEmancipation = new TriplePartDate(formData.dateOfEmancipationYear, formData.dateOfEmancipationMonth, formData.dateOfEmancipationDay);
    this.buyer = formData.buyer;
    this.seller = formData.seller;
    this.dateOfSale = new TriplePartDate(formData.dateOfSaleYear, formData.dateOfSaleMonth, formData.dateOfSaleDay);
    this.dateOfMarriage = new TriplePartDate(formData.dateOfMarriageYear, formData.dateOfMarriageMonth, formData.dateOfMarriageDay);
    this.childrenNames = new ChildrenNames(formData['childFirstName[]'], formData['childLastName[]']).names;
    this.father = formData.father;
    this.raceOfFather = formData.raceOfFather;
    this.originOfFather = formData.originOfFather;
    this.statusOfFather = formData.statusOfFather;
    this.ownerOfFather = formData.ownerOfFather;
    this.mother = formData.mother;
    this.raceOfMother = formData.raceOfMother;
    this.originOfMother = formData.originOfMother;
    this.statusOfMother = formData.statusOfMother;
    this.ownerOfMother = formData.ownerOfMother;
    this.document = {};
    this.document.date = new TriplePartDate(formData.dateOfDocumentYear, formData.dateOfDocumentMonth, formData.dateOfDocumentDay);
    console.log(this.document.date);
    this.document.sourceType = formData.documentSourceType;
    this.document.recordType = formData.documentRecordType;
    this.document.citation = formData.documentCitation;
    this.additionalInformation = formData.additionalInformation;
    this.researcherNotes = formData.researcherNotes;

    this.meta = {};
    return this;
  }
}

class Names {
  constructor(firstNames, lastNames, types) {
    this.names = [];
    if (firstNames && firstNames instanceof Array) {
      for (let i = 0; i < firstNames.length; ++i) {
        this.names.push({
          firstName: firstNames[i],
          lastName: lastNames[i],
          type: types[i]
        });
      }
    } else if (firstNames) {
      this.names.push({
        firstName: firstNames,
        lastName: lastNames,
        type: types
      });
    }
    return this;
  }
}

class OwnerNames {
  constructor(titles, firstNames, lastNames) {
    this.names = [];
    if (firstNames && firstNames instanceof Array) {
      for (let i = 0; i < firstNames.length; ++i) {
        this.names.push({
          title: titles[i],
          firstName: firstNames[i],
          lastName: lastNames[i]
        })
      }
    } else if (firstNames) {
      this.names.push({
        title: titles,
        firstName: firstNames,
        lastName: lastNames
      });
    }
    return this;
  }
}

class ChildrenNames {
  constructor(firstNames, lastNames) {
    this.names = [];
    if (firstNames && firstNames instanceof Array) {
      for (let i = 0; i < firstNames.length; ++i) {
        this.names.push({
          firstName: firstNames[i],
          lastName: lastNames[i]
        });
      }
    } else if (firstNames) {
      this.names.push({
        firstName: firstNames,
        lastName: lastNames
      });
    }
    return this;
  }
}

class TriplePartDate {
  constructor(year, month, day) {
    this.year = Number.parseInt(year) || '';
    this.month = (new Date(`1 ${month} 9999`).getMonth() + 1) || '';
    this.day = Number.parseInt(day) || '';
    return this;
  }
}
