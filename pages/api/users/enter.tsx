import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, phone } = req.body;

  const payload = email ? { email } : { phone: +phone };
  const user = await client.user.upsert({
    where: {
      ...payload,
    },
    create: {
      name: "Anonymous",
      ...payload,
    },
    update: {},
  });
  // if (email) {
  //   user = await client.user.findUnique({ where: { email } });
  //   if (!user) {
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email,
  //       },
  //     });
  //   }
  // }
  // if (phone) {
  //   user = await client.user.findUnique({ where: { phone: +phone } });
  //   if (!user) {
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone,
  //       },
  //     });
  //     console.info(user);
  //   }
  // }

  res.status(200).end();
}

export default withHandler("POST", handler);
