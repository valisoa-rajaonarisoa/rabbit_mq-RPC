import * as amqplib from "amqplib";
import { rabbitMQ } from "./config";
import { Consumer } from "./consumer";
import { Producer } from "./producer";

class RabbitMQClient {
  //private pour empecher de creer new RabbitMqClient a l'exterieur 
  private constructor() {}
  //Instace
  private static instance: RabbitMQClient;

  //boolean
  private isInitialized = false;

  //get instance
  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
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

      //queue , on cree un queue ""==> demande à rabbitMq de cree un nom aleatoire , exclusive:true=> connection privé, seule ma connexion peut l'utiliser et quand la conn est fermé, la queue sera supprimé, le replyQueueName correspond au nom du queue, au lieu d'ecire replyQueueNAME= q.queue

      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        "",
        { exclusive: true }
      );

      //j'appelle maintenant le consommer
      this.consumer = new Consumer(this.consumerChannel, replyQueueName);

      //le producer
      this.producer = new Producer(this.producerChannel, replyQueueName);

      //recevoir le messages

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
  async produce(data: any) {
    //verifier d'abord si la connexion n'existe pas alors on initialise
    if (!this.isInitialized) {
      await this.initialize();
    } else {
      return await this.producer.produceMessages(data);
    }
  }
}

export default RabbitMQClient.getInstance();
