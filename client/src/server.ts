import express, { NextFunction, Request, Response } from "express";

import RabbitMQClient from "./client"
import * as Service1 from "./services/service1";

import * as Service2 from "./services/service2";

const app = express();

app.use(express.json());

//instanier le RabbitMQClient

const PORT = 3008;

//Envoyer maintenant un data
app.post(
  "/operate",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    //envoyer le data
    await RabbitMQClient.produce(req.body);

    await Service1.sendMessage(req.body);

    await Service2.sendMessage(req.body);
  }
);

app.listen(PORT, () => {
  console.log("lancement sur le port ", PORT);

  //initialisation
  RabbitMQClient.initialize();
});
