import amqp from 'amqplib';
import catchAsync from '../utils/catchAsync';

import { Channel, Connection } from 'amqplib';
import { User } from '../types/prisma-client';

const connectRabbitMQ = async (): Promise<[Connection, Channel]> => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();
  return [connection, channel];
};

export const publishUserCreated = catchAsync(async (user: User) => {
  const [connection, channel] = await connectRabbitMQ();

  const exchange = 'user_created';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  channel.publish(exchange, '', Buffer.from(JSON.stringify(user)));

  await channel.close();
  await connection.close();
});
