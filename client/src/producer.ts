import { Channel } from "amqplib";
import { rabbitMQ } from "./config";
import { randomUUID } from "crypto";

//l'objectif principale c'est de consommer le message envoyé qui se trouve dans le replyQueueName (response)
export class Producer {
  constructor(private channel: Channel, private replyQueueName: string) {}

  //methode pour envoyer un message
  async produceMessages(data: any) {
    //on envoye dans la queue, il prend 3 param : (queue: string, content: Buffer, options?: Options.Publish): boolean
    // - Nom du queue
    // - Buffer.from(json.strigly) data
    // - { replyTo: queue , correlationId:uuid}

    const uuid = randomUUID();

    //afficher le uuid 
    console.log("le correlationId est ", uuid);
    await this.channel.sendToQueue(
      //nom du queue
      rabbitMQ.queues.rpcQueue,

      //buffer content
      Buffer.from(JSON.stringify(data)),

      //options
      {
        replyTo: this.replyQueueName, //replyToQueue (adresse string du queue temporaire)
        correlationId: uuid, //uuid de correlation pour differencier les messages responses
      }
    );
  }
}
