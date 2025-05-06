import RabbitMQClient from "./client";

RabbitMQClient.initialize()
  .then(() => {
    console.log("lancement du server ......");
  })
  .catch((error) => {
    console.log("une erreur lors de l'initialisation de RabbitMQServer", error);
  });
