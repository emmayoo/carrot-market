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

  console.info(kind)

  if (typeof kind !== "string" || !Object.keys(Kind).includes(kind)) {
    return res.status(400).json({ ok: false });
  }

  const records = await client.record.findMany({
    where: {
      id: user?.id,
      kind: kind as Kind,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              records: true
            },
          }
        }
      },
    },
  });

  res.json({
    ok: true,
    records,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
