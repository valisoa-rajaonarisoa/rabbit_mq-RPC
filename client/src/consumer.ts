import { Channel, ConsumeMessage } from "amqplib";

//l'objectif principale c'est de consommer le message envoyé qui se trouve dans le replyQueueName (response)
export class Consumer {
  constructor(private channel: Channel, private replyQueueName: string) {}

  //methode pour consommer
  async consumeMessage() {
    console.log("consommation du message en cour .......");

    await this.channel.consume(
      this.replyQueueName,
      (message: ConsumeMessage | null) => {
        // il existe aussi des params comme field, properties à voir
        console.log("message est ", message?.content.toString());
      },
      {
        noAck: true, // alors ici, on envoye une accuse de reception comme quoi on a bien recu le message et on peut le supprimer dans la file
      }
    );
  }
}
