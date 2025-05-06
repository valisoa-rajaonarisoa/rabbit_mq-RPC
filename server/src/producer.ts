import { Channel } from "amqplib";


//il va juste envoyer le resultat vers le ReplyToQueue = queue temporaire recuperé dans le consumer 
export class Producer {
  constructor(private channel: Channel) {}

  //methode pour envoyer un message
  async produceMessages(
    data: any,
    correlationId: string,
    replyToQueue: string
  ) {
    //afficher le uuid

    this.channel.sendToQueue(
      //on envoye vers le queueTemporarire = replyToQueue

      replyToQueue,

      //buffer content
      Buffer.from(JSON.stringify(data)),

      //options
      {
        correlationId: correlationId,
      }
    );
  }
}
