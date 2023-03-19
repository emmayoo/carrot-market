import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;

  const info = await client.token.findUnique({
    where: {
      payload: token,
    },
    // include: { user: true }, // user 정보 포함하기
  });
  console.log(info);

  if (!info) return res.status(400).end();

  req.session.user = {
    id: info.userId,
  };
  await req.session.save();
  await client.token.deleteMany({
    where: {
      userId: info.userId,
    },
  });
  res.json({ ok: true });

  return res.json({
    ok: true,
  });
}

export default withApiSession(withHandler({ method: "POST", handler }));
