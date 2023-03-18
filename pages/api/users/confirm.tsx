import { withIronSessionApiRoute } from "iron-session/next";

import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  console.log(req.session, token);

  const info = await client.token.findUnique({
    where: {
      payload: token,
    },
    // include: { user: true }, // user 정보 포함하기
  });
  console.log(info);

  if (!info) res.status(400).end();

  req.session.user = {
    id: info?.userId,
  };
  await req.session.save();

  return res.json({
    ok: true,
  });
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password: process.env.IRON_SESSION_PASSWORD!, // create cookie
});
