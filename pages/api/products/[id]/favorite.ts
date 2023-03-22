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
    body: { isLiked }
  } = req;

  if (!id) return res.status(500).json({ ok: false });

  const fav = await client.favorite.findFirst({
    where: {
      productId: +id,
      userId: user?.id,
    },
  });

  if (fav && !isLiked) {
    await client.favorite.delete({
      where: {
        id: fav.id,
      },
    });
  } else if (!fav && isLiked) {
    await client.favorite.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id,
          },
        },
      },
    });
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
