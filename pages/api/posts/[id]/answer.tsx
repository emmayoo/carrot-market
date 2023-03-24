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
    query: { id },
    body: { answer },
  } = req;

  if (!id) return res.status(400).json({ ok: false });

  const isExisted = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: +id,
    },
  });

  const newAnswer = await client.answer.create({
    data: {
      answer,
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: +id,
        },
      },
    },
  });

  res.json({
    ok: true,
    answer: newAnswer,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
