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

  const isExisted = await client.post.findFirst({
    where: {
      userId: user?.id,
      id: +id,
    },
    select: {
      id: true,
    },
  });

  if (!isExisted) return res.status(404).redirect("/404");

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
          id: isExisted.id,
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
