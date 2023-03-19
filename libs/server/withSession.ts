import { withIronSessionApiRoute } from 'iron-session/next';

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.IRON_SESSION_PASSWORD!,
}

// 1. API route에서 session을 받아오기 위한 함수
export const withApiSession = (fn: any) => {
	return withIronSessionApiRoute(fn, cookieOptions);
};

// 2. redering 할 때, NextJS의 SSR에서 session을 받오는 함수