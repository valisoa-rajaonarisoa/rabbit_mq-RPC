class Voiture {
  constructor() {}
}

class ObjectVoiture {
  private static instance: Voiture;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Voiture();
    }
  }

  public static hello() {
    return "bonjour saluut";
  }
}
export default ObjectVoiture.getInstance();

const daba = ObjectVoiture.hello();

console.log(daba);
