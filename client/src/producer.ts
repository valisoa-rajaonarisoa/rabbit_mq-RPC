import { Channel } from "amqplib";
import { rabbitMQ } from "./config";
import { randomUUID } from "crypto";
import EventEmitter from "events";


//l'objectif principale c'est de consommer le message envoyé qui se trouve dans le replyQueueName (response)

//aussi on ecoute l'event ,
export class Producer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  //methode pour envoyer un message
  async produceMessages(data: any) {
    //on envoye dans la queue, il prend 3 param : (queue: string, content: Buffer, options?: Options.Publish): boolean
    // - Nom du queue
    // - Buffer.from(json.strigly) data
    // - { replyTo: queue , correlationId:uuid}

    const uuid = randomUUID();

    //afficher le uuid
    console.log("le correlationId est ", uuid);

    this.channel.sendToQueue(
      //nom du queue, que existant ce n'est pas le temporaire
      rabbitMQ.queues.rpcQueue,

      //buffer content
      Buffer.from(JSON.stringify(data)),

      //options
      {
        replyTo: this.replyQueueName, //replyToQueue (adresse string du queue temporaire)
        correlationId: uuid, //uuid de correlation pour differencier les messages responses
      }
    );

    //event, alors ici on definie le event avec le nom, puis une fonction qui prend en param le data ou le message si celui ci est decleché , on va simplement l'afficher

    // const response = JSON.parse(data.content.toString());
    // return response;

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, (data) => {
        try {
          const resultat = JSON.parse(data.content.toString());
          //pas d'error alors 
          resolve(resultat);
        } catch (err) {
          //au cas ou 
          reject("Erreur lors du parsing JSON");
        }
      });
    });
  }
}
