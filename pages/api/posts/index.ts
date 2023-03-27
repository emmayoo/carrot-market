import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { question, latitude, longitude },
    } = req;

    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      post,
    });
  }

  if (req.method === "GET") {
    const { latitude, longitude } = req.query;
    const geoDiff = 0.01;

    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wonderings: true,
            answers: true,
          },
        },
      },
      where: {
        latitude: {
          gte: latitude ? (+latitude - geoDiff) : undefined,
          lte: latitude ? (+latitude + geoDiff) : undefined,
        },
        longitude: {
          gte: longitude ? (+longitude - geoDiff) : undefined,
          lte: longitude ? (+longitude + geoDiff) : undefined,
        }
      }
    });

    res.json({
      ok: true,
      posts,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: false })
);
