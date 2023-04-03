import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { message },
    query: { id },
  } = req;

  if (!id) return res.status(400).json({ ok: false });

  const createdMessage = await client.message.create({
    data: {
      message,
      stream: {
        connect: {
          id: +id,
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  res.json({ ok: true, message: createdMessage });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
