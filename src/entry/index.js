class Entry {
  constructor() {
    this.person = new Person();
    this.owner = new Owner();

    this.dateOfRunaway = new TriplePartDate();
    this.dateOfEmancipation = new TriplePartDate();

    this.buyer = new Name();
    this.seller = new Name();

    this.dateOfSale = new TriplePartDate();
    this.dateOfMarriage = new TriplePartDate();
    
    this.document = new Document();

    this.additionalInformation = "";
    this.researcherNotes = "";

    this.meta = new Meta();
  }
}

class Person {
  constructor() {
    this.names = [];
    this.tribe = "";
    this.origin = "";
    this.race = "";
    this.sex = "";
    this.age = undefined;
    this.typeKindOfEnslavement = "";
    this.vocation = "";
    
    this.father = new Parent();
    this.mother = new Parent();
    this.children = [];
  }
}

class Parent {
  constructor() {
    this.name = new Name();
    this.race = "";
    this.origin = "";
    this.status = "";
    this.owner = new Owner();
  }
}

class Childen {
  constructor() {
    this.name = new ChildName();
  }
}

class Name {
 constructor() {
   this.firstName = "";
   this.lastName = "";
 }
}

class PersonName extends Name {
  constructor() {
    super();
    this.type = "";
  }
}

class ChildName extends Name {
  constructor() {
    super();
  }
}

class ParentName extends Name {
  constructor() {
    super();
  }
}

class Owner {
  constructor() {
    this.name = new OwnerName();
    this.vocation = "";
  }
}

class OwnerName extends Name {
  constructor() {
    super();
    this.title = "";
  }
}

class TriplePartDate {
  constructor() {
    this.year = undefined;
    this.month = undefined;
    this.day = undefined;
  }
}

class Document {
  constructor() {
    this.date = new TriplePartDate();
    this.stringLocation = "";
    this.colonyState = "";
    this.nationalContext = "";
    this.sourceType = "";
    this.recordType = "";
    this.citation = "";
  }
}

class Meta {
  constructor() {
    this.stage = "";
    this.creator = "";
    this.lastModified = new Date();
    this.updatedBy = "";
    this.idPrefix = "";
    this.idSuffix = "";
  }

  get id() {
    return `${this.idPrefix}-${this.idSuffix}`;
  }

  set id(idString) {
    let [prefix, suffix] = idString.split("-");
    this.prefix = prefix;
    this.suffix = suffix;
  }
}
