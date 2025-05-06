export const rabbitMQ = {
  url: "amqp://admin:admin@localhost", //url du server : amqp://nom_user:mdp_user@url

  queues: {
    rpcQueue: "rpc_queue", //nom du queue requettes, (lorsqu'on envoye une requette)
  },
};
