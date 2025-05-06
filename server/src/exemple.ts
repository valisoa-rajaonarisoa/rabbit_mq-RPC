type DataBaseType = any;
class Database {
  //l'instace unique
  private static instance: DataBaseType;

  //constructeur privé alors on ne peut pas faire new Database

  private constructor() {
    console.log("connexion au bdd");
  }

  //le getteur de l'instance, il est static mais public => pas besoin de instacier mais prvé
  public static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  public hello(){
    console.log("bonjour")
  }
}


export default Database.getInstance()
const db1 = Database.getInstance();
