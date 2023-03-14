import withHandler from "@libs/server/withHandler";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body.email);
  res.status(200).end();
}

export default withHandler("POST", handler);
