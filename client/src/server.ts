import express, { NextFunction, Request, Response } from "express";

import RabbitMQClient from "./client";

const app = express();

app.use(express.json());

//instanier le RabbitMQClient

const PORT = 3008;

//Envoyer maintenant un data
app.post(
  "/operate",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);

      //envoyer le data
      const response = await RabbitMQClient.produce(req.body);

      //recevoir
      res.send(response);
    } catch (error) {
      console.log("une error lors de l'envoye et recuperation ", error);
    }
  }
);

app.listen(PORT, () => {
  console.log("lancement sur le port ", PORT);

  //initialisation
  RabbitMQClient.initialize();
});
