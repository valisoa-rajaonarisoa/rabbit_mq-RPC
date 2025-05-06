import RabbitMQServer from "./client";
export default class MessangeHandler {
  static async handle(data: any, replyToQueue: string, correlationId: string) {
    const { operation, num1, num2 } = data;

    try {
      let response;

      switch (operation) {
        case "addition":
          response = num1 + num2;
          break;

        case "soustraction":
          response = num1 - num2;
          break;

        default:
          response = num1 * num2;
          break;
      }

      //envoyer le resultat
      await RabbitMQServer.produce(response, correlationId, replyToQueue);

      console.log("calcule effectué avec success, et envoyé vers le client");
    } catch (error) {
      console.log(
        "une error lors de l'envoye du response server --> client",
        error
      );
    }
  }
}
