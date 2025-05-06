

import RabbitMQClient from "../client"
export const sendMessage = async (data: any) => {
  return await RabbitMQClient.produce(data);
};
