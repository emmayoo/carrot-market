import client from '@libs/server/client';
import withHandler, { type ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { user } = req.session;

  if(req.method === "GET") {
    const products = await client.product.findMany({
      where: {
        userId: user?.id
      }
    })
  
    res.json({
      ok: true,
      products
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
            id: user?.id
          }
        }
      }
    })
  
    res.json({
      ok: true,
      product
    });
  }  
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: false })
);
