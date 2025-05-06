import { Channel, ConsumeMessage } from "amqplib";
import EventEmitter from "events";

//l'objectif principale c'est de consommer le message envoyé qui se trouve dans le replyQueueName (response)

//il aussi il va declenché un event, si un message est arrivé
export class Consumer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  //methode pour consommer
  async consumeMessage() {
    console.log("consommation du message en cour .......");

    //la on ecoute le replyQueueName , temporaire
    await this.channel.consume(
      this.replyQueueName,
      (message: ConsumeMessage | null) => {
        // il existe aussi des params comme field, properties à voir
        console.log("message est ", message?.content.toString());

        //alors ici, on declenche un event en precisant le nom et le data à envoyé
        //le nom = correlationID dans le properties, car c'est unique 
        //data a envoyé= message
        if (message) {
          this.eventEmitter.emit(
            message.properties.correlationId.toString(),
            message
          );
        }
      },
      {
        noAck: true, // alors ici, on envoye une accuse de reception comme quoi on a bien recu le message et on peut le supprimer dans la file
      }
    );
  }
}
