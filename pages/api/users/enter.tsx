import twilio from "twilio";
import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";

import type { NextApiRequest, NextApiResponse } from "next";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, phone } = req.body;

  const profile = email ? { email } : phone ? { phone: +phone } : null;
  if (!profile) return res.status(400).json({ ok: false });

  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...profile,
          },
          create: {
            name: "Anonymous",
            ...profile,
          },
        },
      },
    },
  });

  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_SERVICE_SID,
      to: process.env.MY_PHONE_NUMBER!,
      body: `Your login token is ${payload}.`,
    });
    console.log(message);
  }

  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
