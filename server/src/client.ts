import * as amqplib from "amqplib";
import { rabbitMQ } from "./config";
import { Consumer } from "./consumer";
import { Producer } from "./producer";

class RabbitMQServer {
  //private pour empecher de creer new RabbitMQServer a l'exterieur
  private constructor() {}
  //Instace
  private static instance: RabbitMQServer;

  //boolean
  private isInitialized = false;

  //get instance
  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQServer();
    }
    return this.instance;
  }
  // Producer
  private producer!: Producer;

  // Consumer
  private consumer!: Consumer;

  // Channel pour chaque élément
  private producerChannel!: amqplib.Channel;
  private consumerChannel!: amqplib.Channel;

  // Connexion
  private connection!: amqplib.Connection;

  // Fonction d'initialisation
  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      // Création de la connexion
      this.connection = await amqplib.connect(rabbitMQ.url as string);

      // Création des channels
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      //le queue ou on doit recevoir le data du client (c'est le rpc_queue)
      const { queue: rpcQueueName } = await this.consumerChannel.assertQueue(
        rabbitMQ.queues.rpcQueue,
        { exclusive: true }
      );

      //j'appelle maintenant le consommer
      this.consumer = new Consumer(this.consumerChannel, rpcQueueName);

      //le producer
      this.producer = new Producer(this.producerChannel);

      //recevoir le messages, alors j'ectoue tjrs si si on initialize la class
      await this.consumer.consumeMessage();

      this.isInitialized = true;
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation du client RabbitMQ :",
        error
      );
    }
  }

  //fonction pour envoyer des messages
  async produce(data: any, correlationId: string, replyToQueue: string) {
    //verifier d'abord si la connexion n'existe pas alors on initialise
    if (!this.isInitialized) {
      await this.initialize();
    } else {
      return await this.producer.produceMessages(
        data,
        correlationId,
        replyToQueue
      );
    }
  }
}

export default RabbitMQServer.getInstance();
