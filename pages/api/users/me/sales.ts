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
  } = req;

  const sales = await client.sale.findUnique({
    where: {
      id: user?.id,
    },
    include: {
      product: true,
    },
  });

  res.json({
    ok: true,
    sales,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
