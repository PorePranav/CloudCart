import amqp from "amqplib";
import catchAsync from "../utils/catchAsync";

import mailGenerator from "../utils/mailGen";

import { Channel, Connection } from "amqplib";
import { sendEmail } from "../utils/sendEmail";

import { MailOptions } from "../types";
import { User } from "shared-types/prisma/auth";

const connectRabbitMQ = async (): Promise<[Connection, Channel]> => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();
  return [connection, channel];
};

export const listenUserCreated = catchAsync(async () => {
  const [connection, channel] = await connectRabbitMQ();
  const queue = "user_created";

  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, async (msg) => {
    if (msg) {
      const user: User = JSON.parse(msg.content.toString());

      const email = {
        body: {
          name: user.name,
          intro: "Welcome to CloudCart! We are excited to have you on board.",
          action: {
            instructions:
              "To get started, click the button below to visit your dashboard:",
            button: {
              color: "#00B7EB",
              text: "Go to Dashboard",
              link: `https://cloudcart.pranavpore.com`,
            },
          },
          outro:
            "If you have any questions, feel free to reach out to our support team.",
        },
      };

      const emailBody = mailGenerator.generate(email);

      const emailOptions: MailOptions = {
        to: user.email,
        subject: "Welcome to CloudCart!",
        emailBody,
      };

      sendEmail(emailOptions);
      channel.ack(msg);
    }
  });
});
