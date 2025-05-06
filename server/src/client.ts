import * as amqplib from "amqplib";
import { rabbitMQ } from "./config";

export class RabbitMQClient {
  // Producer
  private producer: any;

  // Consumer
  private consumer: any;

  // Channel pour chaque élément
  private producerChannel!: amqplib.Channel;
  private consumerChannel!: amqplib.Channel;

  // Connexion
  private connection!: amqplib.Connection; // Correction : Utiliser le bon type

  // Fonction d'initialisation
  async initialize() {
    try {
      // Création de la connexion
      this.connection = await amqplib.connect(rabbitMQ.url as string); // Retourne une promesse résolue en Connection

      // Création des channels
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      console.log("RabbitMQ client initialisé avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation du client RabbitMQ :",
        error
      );
    }
  }
}
