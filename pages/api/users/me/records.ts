import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

import type { NextApiRequest, NextApiResponse } from "next";
import { Kind } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { kind },
  } = req;

  if (kind !== "string" || !Object.keys(Kind).includes(kind)) {
    return res.status(400).json({ ok: false });
  }

  const favorites = await client.record.findMany({
    where: {
      id: user?.id,
      kind: kind as Kind,
    },
    include: {
      product: true,
    },
  });

  res.json({
    ok: true,
    favorites,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
