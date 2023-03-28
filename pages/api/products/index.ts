import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { user } = req.session;

  if (req.method === "GET") {
    const products = await client.product.findMany({
      where: {
        records: {
          every: {
            kind: "Favorite",
          },
        },
      },
      include: {
        // favorites: true, // favorites의 모든 정보를 가져오기 때문에 안 됨
        _count: {
          select: {
            records: true,
          },
        },
      },
    });

    res.json({
      ok: true,
      products,
    });
  }
  if (req.method === "POST") {
    const { name, price, description } = req.body;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        imageUrl: "just-for-now",
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: false })
);
