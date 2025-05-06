import { Channel, ConsumeMessage } from "amqplib";
import MessangeHandler from "./messageHandler";

//l'objectif principale c'est de consommer le message envoyé , qui se trouve dans le RPC_QUEUE (que le client a envoyer le replyTo)
export class Consumer {
  constructor(private channel: Channel, private rpcQueue: string) {}

  //methode pour consommer
  async consumeMessage() {
    console.log("consommation du message en cour du server .......");
    //la on ecoute le rpc qu'on a envoyé le message ()
    await this.channel.consume(
      this.rpcQueue,
      async (message: ConsumeMessage | null) => {
        // il existe aussi des params comme field, properties à voir
        // console.log("message est ", message?.content.toString());

        if (message) {
          const { replyTo, correlationId } = message.properties;

          if (!replyTo || !correlationId) {
            //pas de replyTo ou correlation

            console.log("veuillez verifier la replyTo ou la correlationId ...");
          } else {
            console.log(
              "message recu du client , voila le replyTo adresse du queue Temporaire",
              message.properties.replyTo
            );

            //recuperation des data dans le content en string , puis en json
            const data = JSON.parse(message.content.toString());

            //faire le calcul dans MessangeHandler, puis envoyer la response à replyTo
            await MessangeHandler.handle(data, replyTo, correlationId);
          }
        }
      },
      {
        noAck: true, // alors ici, on envoye une accuse de reception comme quoi on a bien recu le message et on peut le supprimer dans la file
      }
    );
  }
}
