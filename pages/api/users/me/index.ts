import client from "@libs/server/client";
import withHandler, { type ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });

    if (!profile) {
      return res.status(400).json({
        ok: false,
      });
    }

    res.json({
      ok: true,
      profile,
    });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name, avatarId },
    } = req;

    const currentUserInfo = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUserInfo?.email) {
      const alreadyExist = await client.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (alreadyExist) {
        return res.json({
          ok: false,
          error: "Email already taken.",
        });
      }
      await client.user.update({
        where: { id: user?.id },
        data: {
          email,
        },
      });
    }

    if (phone && phone !== currentUserInfo?.phone) {
      const alreadyExist = await client.user.findUnique({
        where: {
          phone,
        },
        select: {
          id: true,
        },
      });
      if (alreadyExist) {
        return res.json({
          ok: false,
          error: "Phone already taken.",
        });
      }
      await client.user.update({
        where: { id: user?.id },
        data: {
          phone,
        },
      });
    }

    // name can be duplicated.
    if (name) {
      await client.user.update({
        where: { id: user?.id },
        data: {
          name,
        },
      });
    }

    if (avatarId) {
      await client.user.update({
        where: { id: user?.id },
        data: {
          avatar: avatarId,
        },
      });
    }

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
