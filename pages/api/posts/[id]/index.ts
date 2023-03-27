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
  } = req;

  if (!id) return res.status(400).json({ ok: false });

  const post = await client.post.findUnique({
    where: {
      id: +id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      answers: {
        select: {
          id: true,
          answer: true,
          user: {
            select: { id: true, name: true, avatar: true },
          },
          createdAt: true,
        },
      },
      _count: {
        select: {
          answers: true,
          wonderings: true,
        },
      },
    },
  });

  const isWondering = await client.wondering.findFirst({
    where: {
      postId: +id,
      userId: user?.id,
    },
    select: {
      id: true,
    },
  });

  res.json({
    ok: true,
    post,
    isWondering: Boolean(isWondering),
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
