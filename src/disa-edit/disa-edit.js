class DisaEdit extends Polymer.Element {
  
  static get is() { return 'disa-edit'; }

  static get properties() {
    return {
      entry: {
        type: Object
      },
      entryId: String,
      active: Boolean,
      saveResponse: {
        type: Object
      }
    };
  }

  static get observers() {
    return [
      '__entryIdChanged(entryId)',
      '__entryChanged(entry)',
      'activeChanged(active)',
      '__saveResponse(saveResponse)'
    ]
  }

  constructor() {
    super();
    this.apiHost = "http://cole-mint";
  }
  
  connectedCallback() {
    super.connectedCallback();

    let self = this;
    this.$.form.addEventListener('iron-form-presubmit', function(e) {
      console.log("presubmit");
      e.preventDefault();
      self.submitForm(this, e);
      return false;
    });
  }

  activeChanged(active) {
    if (active && !Utils.isSignedIn()) {
      alert("Please sign in.");
      window.history.pushState({}, null, '/#/');
      window.dispatchEvent(new CustomEvent('location-changed'));
      window.scrollTo(0,0);
      return;
    } else {
      this.$.form.reset();
      this.set('entryId', undefined);
    }
  }

  __entryIdChanged(entryId) {
    // trigger new ajax request
    if (entryId === undefined) {
      console.log("undefined");
    } else if (entryId === 'new') {
      this.set('entry', new Entry());
    } else {
      this.$.getAjax.generateRequest();
    }
  }

  __entryChanged(entry) {
    console.log(entry);
    if (!entry) {
      alert("This is not a valid entry. If you got here from clicking on an entry on the dashboard, email Cole.");
      window.history.pushState({}, null, '/#/dashboard');
      window.dispatchEvent(new CustomEvent('location-changed'));
      window.scrollTo(0,0);
    }
  }

  __header(entryId, entry) {
    if (entryId == 'new') {
      return 'New Person';
    } else {
      return `This is DISA-${this.entry && this.entry.meta && this.entry.meta.category || ''}-${this.entry && this.entry.meta && this.entry.meta.identifier || ''}`;
    }
  }

  _toLocaleString(date) {
    return date && new Date(date).toLocaleString();
  }

  save() {
    this.__stageAction = 'save';
    this.prepareForm();
  }

  releaseToTeam() {
    this.__stageAction = 'releaseToTeam';
    this.prepareForm()
  }

  prepareForm() {
    console.log('prepare')
    this.$.spinnerContainer.style.display = "block";
    this.$.saveSpinner.active = true;
    this.$.saveSpinner.hidden = false;
    this.$.form.disabled = true;
    this.$.form.submit();
  }

  submitForm(form, e) {
    console.log('submit');
    let body = new Entry();
    let formData = form.request.params;

    let person = this.$.person.createFromData(formData);

    body.person = person;

    console.log(body);
    // body.meta = self.entry && self.entry.meta || {};
    let meta = new Meta();
    meta.lastModified = new Date();
    // body.meta.updatedBy = this.userId;
    if (this.entry.meta.stage) {
      if (this.__stageAction == 'save') {
        meta.stage = this.entry.meta.stage;
      } else {
        if (this.entry.meta.stage === 'Public') {
          meta.stage = 'Public';
        } else {
          meta.stage = 'Internal';
        }
      }
    } else {
      this.__stageAction === 'save' ? meta.stage = 'Draft' : meta.stage = 'Internal';
    }
    // body.meta.creator = body.meta.creator || localStorage.getItem("id");
    // if (self.entryId != 'new') {
    //   body._id = self.entryId;
    // }
    body.meta = meta;

    this.setProperties({
      saveBody: body,
      saveMethod: this.entryId == 'new' ? 'POST' : 'PUT',
      saveUrl: this.entryId == 'new' ? `${this.apiHost}/entries` : `${this.apiHost}/entries/${this.entryId}`
    });
    console.log("Headers");
    console.log(this.headers);

    this.$.saveAjax.generateRequest();
  }

  __saveResponse(saveResponse) {
    this.$.spinnerContainer.style.display = "none";
    this.$.saveSpinner.active = false;
    this.$.saveSpinner.hidden = true;
    this.$.form.disabled = false;
    if (typeof saveResponse === 'undefined') {
      return;
    }
    console.log(saveResponse);
    if (saveResponse && (saveResponse.status == 200 || saveResponse.status == 201 || saveResponse.status == 204)) {
      this.$.form.reset();
      this.set('entryId', undefined);
      this.cancel();
      this.dispatchEvent(new CustomEvent('reload-needed', {
        bubbles: true,
        composed: true
      }));
    } else {
      alert("There was an error. Please try again.");
    }
    this.set('saveResponse', undefined);
  }

  cancel() {
    window.history.pushState({}, null, '/#/dashboard');
    window.dispatchEvent(new CustomEvent('location-changed'));
    window.scrollTo(0,0);
  }
}

window.customElements.define(DisaEdit.is, DisaEdit);
