# carrot-market
* 노마드코더 [[풀스택] 캐럿마켓 클론코딩](https://nomadcoders.co/carrot-market) 강의 프로젝트
* 언어: Next.JS, Prisma, Tailwind, Serverless
* 프론트엔드 & 백엔드: NextJS (+Serverless)
* 디플로이: Vercel
* 깃헙 (강의 자료) : [nomadcoders/carrot-market](https://github.com/nomadcoders/carrot-market)

## Install
### NextJS + Typescript
* `npx create-next-app@latest --typescript`
* React 18
### Tailwind
* `npm install -D tailwindcss autoprefixer`
* `npx tailwind init -p`
  * Created Tailwind CSS config file: tailwind.config.js
  * Created PostCSS config file: postcss.config.js
* **Tailwind CSS IntelliSense**
  * Tailwind 클래스명 자동 완성 Extension

## NextJS Framework
* **페이지가 초기 상태값으로 pre-generate 됨**
### Global Styles in NextJS
  * [참고 영상](https://nomadcoders.co/nextjs-fundamentals/lectures/3443)
  * App Component
    * `_app.js` (**파일명** 중요! 단, _app.js에 클래스명은 중요하지 않음)
		* ```js
			export default function App({Component, pageProps}) {
				return <Component {...pageProps} />
			}
			```
        * Component : 렌더링 할 페이지 컴포넌트
        * pageProps : 페이지 props
    * NextJS는 어떤 페이지가 렌더링되기 전에 먼저 App을 확인함
    * 일종의 blueprint (어떤 컴포넌트가 어떤 페이지에 어떻게 있어야 하는지)
  * "Global CSS cannot be imported from files other than your Custom `<App>`"
    * 커스텀 App 이외의 파일로부터 global.css를 import 할 수 없음
    * 즉, Custom `<App>` 컴포넌트에서만 `import './styles/xxx.css';` 가능
    * pages나 components에 css를 import하려면 module 형태여야만 함
### Routing
* pages 폴더에 페이지들을 만들면 다른 작업 없이 Routing 처리가 됨
* Dynamic Routes : 파일명에 대괄호([]) 활용
  * 예를 들어, `pages/items/[id].tsx`은 `http://localhost:3000/items/2`로 접근 가능
### Api
* `/pages/api` 하위에 api 파일 넣기 (따라서, 백엔드를 위한 서버 구축하지 않아도 됨)
* Api Routes를 위한 규칙은 connection handler 함수를 **export default** 하면 됨
* function은 무조건 export default하기 (그렇지 않으면, 작동하지 않음)
* url에 접근 시, NextJS가 실행할 function을 return하는 function을 만들어야 함
* NextJS는 req와 res를 제공
* `/pages/api/items/[...id].ts` 파일 & api url `/api/items/1/2/3`
  * `const { id } = req.query; // [1, 2, 3]` (타입이 string[])
* NextJS와 api router만 쓴다면, NextJS severless 환경에서는 실시간을 만들 수 없음
  * Web Socket(실시간)을 쓸 수 없는 이유는 말 그대로 서버가 없기 때문
  * 실시간을 만들기 위해서는 서버가 필요하고, 클라이언트와 연결을 계속 유지해야 함
  * 눈속임으로 bound mutate 쓰는 방법이 있음 
### Hooks
* useRouter
  ```js
  import { useRouter } from "next/router";
  ...
  const router = useRouter();
  router.push("/"); // redirect
  router.replace("/"); // replace
  ```
  * redirect : history 남음
    * history : 브라우저에 페이지가 성공적으로 load 되는 경우, `<title>`가 남음 (Http status code 401, 404의 경우 안 남음)
  * replace : history 안 남음
  * `router.query`
    * dynamic routing 인 url의 데이터 조회 가능
    * 예를 들어, `/pages/items/[id].tsx` & `example.com/items/1` 페이지 접근 시 `router.query.id`의 값은 1
    * 하지만, 라우터가 mount 중 일때 **undefined**
### Head
```js
import Head from "next/head";
...
<Head>
  <title>Home</title>
</Head>
```
### [next/image](https://nextjs.org/docs/api-reference/next/image) 
* [Image Component](https://nextjs.org/docs/basic-features/image-optimization) 를 사용하면 무료로 이미지 최적화를 할 수 있음
  * Lazy loading
  * local image가 있을 때, 해당 이미지에 대한 placeholder를 만듦
  * remote image는 next js image server가 Cloudflare에 이미지를 요청하고 받아와 이미지를 압축하고 포맷을 바꿔줌
    * local image 만큼의 최적화는 못함(?)
    * 예를 들어, placeholder
    * `blurDataURL` prop으로 placeholder 이미지 넣을 수 있음
  * 기본적으로는 webp를 줌 (?)
  * `layout="fill"` (**depricated**)
    * css `object-fit`와 함께 잘 쓰임
    * 대신 `fill` prop 사용하기
* NextJS는 `/_next/image` API Handler를 가지고 무료로 이미지를 압축
  * `q`(quality) query string 으로 품질 변경 가능

## Tailwind
### class 
* flex + [space](https://tailwindcss.com/docs/space)
  * reverse : 순서 뒤집기
* 클래스명 앞에 음수 붙이면 음수값
  * 예를 들어, `top-[-5px]`와 `-top-[5px]` 같음
* [min-h-screen](https://tailwindcss.com/docs/min-height#setting-the-minimum-height)
* [aspect-square](https://tailwindcss.com/docs/aspect-ratio#browser-support)
* [ring](https://tailwindcss.com/docs/ring-width)
  ```jsx
    <button className="w-5 h-5 rounded-full bg-yellow-500 focus:ring-2 ring-offset-2 ring-yellow-500 transition" />
  ```
  * 'focus' modifier를 ring-2에만 쓴 이유 ? ring-offset-2와 ring-yellow-500은 variable일 뿐임
* [place-content-center](https://tailwindcss.com/docs/place-content#center)
* [appearance-none](https://tailwindcss.com/docs/appearance) : reset any browser specific styling on an element
* [select-text](https://tailwindcss.com/docs/user-select#disabling-text-selection)
* [divide](https://tailwindcss.com/docs/divide-width)
  * `divide-y-2` === `border-b-2 & last:border-b-0`
* inset
  ```css
    .inset-x-0 {
      left: 0px;
      right: 0px;
    }
  ```
* [aspect](https://tailwindcss.com/docs/aspect-ratio#setting-the-aspect-ratio)
  * `aspect-video` : 16:9 비율로 자동으로 계산
  * `aspect-sqaure w-full rounded-full`

### [Modifiers](https://tailwindcss.com/docs/hover-focus-and-other-states)
* hover, active, focus 등등
  * focus : tab 버튼으로 이동되어 활성화 된 상태
* viewports를 타겟으로 할 때도 사용 가능
  * mobile only, big screen only, 화면 방향, 인쇄시 인쇄 스타일에 따른 스타일 등 조절 가능
* first, secode, only, odd, even, empty
  ```jsx
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="odd:bg-blue-50 even:bg-yellow-50 first:bg-teal-50 last:bg-amber-50"
      >
        <span className="font-semibold">{i}</span>
      </div>
    ))}
  ```
  ```jsx
    {[1].map((i) => (
      <div key={i} className="only:bg-blue-50">
        <span className="font-semibold">{i}</span>
      </div>
    ))}
  ```
  ```jsx
    {["a", "b", "c", ""].map((c, i) => (
      <li className="bg-red-500 py-2 empty:hidden" key={i}>
        {c}
      </li>
    ))}
  ```
* required, invalid, valid, placeholder, placeholder-shown, disabled
* group
  ```html
    <div className="w-full h-full group bg-slate-400">
      <div className="w-1/2 h-1/2 bg-blue-400 group-hover:bg-red-400">hi</div>
    </div>
  ```
* peer modifier
  * peer는 peer selector 보다 앞에 와야함
  * js 없이도 상태를 가지고 노출 여부 제한 가능
  * 예를 들어, input 태그의 값(state)의 유무로 span 태그 노출 여부를 판단 가능
  ```html
    <input type="text" className="peer" required placeholder="Username" />
    <span className="hidden peer-invalid:block peer-invalid:text-red-500">
      This input is invalid
    </span>
  ```
* selection, open
  ```html
    <details className="select-none open:text-white open:bg-purple-300">
      <summary className="cursor-pointer">Toggle</summary>
      <span>Content</span>
    </details>
  ```
  * `select-none`은 화살표 클릭 시, 문자가 선택되는 것 방지
* marker
  ```html
    <ul className="list-decimal marker:text-teal-400">
      <li>aa</li>
      <li>bb</li>
    </ul>
  ```
* file
  ```html
    <input type="file" className="file:border-0 file:bg-purple-500 file:hover:bg-red-400" />
  ```
  * 버튼의 css만 변경함 (버튼 옆 문구 x)
* first-letter
  ```html
    <p className="first-letter:text-7xl">abcd</p>
  ```
* sm, md, lg etc..
  * 작은 크기부터 점차 큰 화면으로 개발 가능
  ```html
    <div className="bg-red-500 sm:bg-yellow-500 sm:hover:bg-purple-500 md:bg-green-500">abcd</p>
  ```
* [portrait, landscape](https://tailwindcss.com/docs/hover-focus-and-other-states#viewport-orientation)
* dark
  * Tailwind css의 dark mode는 기본적으로 브라우저 설정을 따름
    * 즉, 컴퓨터 시스템 설정에 따름
    * 예를 들어, Window: 개인 설정 > 색 > 색 선택
    * tailwind.config.js `darkMode: "media"` (default)
  * 어플리케이션에서 다크 모드 설정하려면(toggle), tailwind.config.js  `darkMode: "class"`로 변경하기
    * 'class' 방식에서 다크모드를 활성화하기 위해 필요한 조건은, `dark:` modifier를 쓰는 요쇼의 **부모 요소에 `dark` className을 추가하기**

### JIT (Just In Time) 컴파일러
* Tailwind CSS 3.0에 JIT가 추가됨
* 코드를 감시하면서 필요한 클래스를 생성
* 여러가지 선택자를 중첩하여 사용 가능 `dark:sm:hover:bg-teal-300`
* 특정한 값을 지정하여 클래스 생성 가능 `bg-[#r5e6aa33]`
* [개발자 도구 > Element 탭] head에 style 태그를 보면, 파일에 쓰이는 클래스만 추가되어 있는 것을 확인 가능
* 이 전에 Tailwind CSS 는...
  * 진짜로 하나의 커다란 CSS 파일이었음
  * selector을 중첩하여 사용할 수 없음 (조합의 수가 많아 파일이 너무 커지기 때문)
  * **purging** : 배포 파일의 크기를 줄이기 위해 프로젝트 빌드 시, 모든 파일을 스캔하여 CSS 파일에 포함된 클래스명을 제외한 나머지 클래스를 전부 삭제하는 작업
  * tailwind 에서 제공하는 클래스 외에 다른 값을 사용하기 위해서는 inline-css를 사용했었음. `<div style={{ fontSize: 300px }} className="text-sm"/>`

### Plugins
* @tailwindcss/forms
  * Form의 기본 스타일을 갖도록 해주는 플러그인

## Prisma
* Node.js와 Typescript ORM
* SQL 없이 JS(TS) 코드로 DB와 상호작용
  * TS를 사용하여 오류 발생 전에 체크 가능
* PostgreSQL, MySQL, SQL Server, SQLite, MongoD 제공
  * Prisma를 사용하면 어떤 DB에 연결해도 큰 차이 없음
### How to use
* `schema.prisma` 파일
  * js로 DB 구조 및 타입 정의
    * model들을 DB에 push하고 SQL migration을 자동으로 처리
  * prisma는 주어진 정보를 통해 client 생성 (자동 완성 기능 제공)
* Prima Studio
  * Visual Database Browser
  * DB를 위한 Admin Panel
* [Prisma Extention VSC](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
  * syntax highlighting, formatting, auto-completion, jump-to-definition and linting for .prisma files.
* PrismaClient
  * `@prisma/client` 설치
  * `npx prisma generate` 입력 후, 콘솔 확인
  * `node_modules\.prisma\client\index.d.ts` 파일 확인
    * prisma가 schema를 확인하여 Typescript로 type을 만듦
  * 브라우저에서는 import 시 보안상 이슈로 에러 발생됨
    * 단, pages/api 하위 파일(백엔드)에서는 import 하여 사용 가능
    * 예를 들어 아래 코드 입력 후 `http://localhost:3000/api/client-test` url 접근 시, User 테이블에 row 하나 생김
    ```js
    // pages/api/client-test
    import { NextApiRequest, NextApiResponse } from "next";
    import client from "../../libs/client";

    export default async function handler(
      req: NextApiRequest,
      res: NextApiResponse
    ) {
      await client.user.create({
        data: {
          email: "test@example.com",
          name: "myname",
        },
      });
      res.json({
        ok: true,
        data: "xx",
      });
    }

    ```
### Install
* `npm i prisma -D`
* `npx prisma init`
  * prisma 폴더 생성
  * .env 파일 생성
* Next steps 중 (in 터미널 콘솔)
  * `.env` 파일에 DATABASE_URL를 PlanetScale 주소로 변경
    ```js
    // pscale connect carrot-market 명령어가 실행된 상태여야 함 (터미널 켜진 상태로 유지)
    DATABASE_URL="mysql://127.0.0.1:3306/carrot-market"
    ```
  * `schema.prisma` 에 privider를 "mysql"로 변경
* `npm install @prisma/client`
  * client 초기화
    * `/libs/client.ts` 파일 생성
    ```js
    import { PrismaClient } from '@prisma/client';
    export default new PrismaClient();
    ```
### Model Example
* `schema.prisma` 파일에 User model 정의
```prisma
  model User {
    id  Int @id @default(autoincrement())
    phone Int? @unique
    email String? @unique
    name String
    avatar String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
```
  * @id : primary key
  * @default(autoincrement()) : 따로 건들지 않으면 1, 2, 3 으로 증가
  * ? (optional) : not required
  * @unique : unique value
  * @updatedAt : updated when user's info changed
```sh
> npx prisma db push
```
  * planetscale에서 [MySQL 버전의 schema 확인 가능](https://app.planetscale.com/emmayoo9663/carrot-market/main)
```sh
> npx prisma studio
```
### upsert
* insert & update
* 예를 들어, email 또는 phone으로 사용자가 없으면 생성하기
```js
const payload = email ? { email } : { phone: +phone };
const user = await client.user.upsert({
  where: {
    ...payload,
  },
  create: {
    name: "Anonymous",
    ...payload,
  },
  update: {},
});
```
### create / connectOrCreate / connect
* create : 새로운 token과 새로운 user를 만듦
* connect : 새로운 token을 이미 존재하는 user와 연결
* connectOrCreate : user를 찾고 있으면 이미 존재하는 user 없으면 새로운 user를 만들어 연결
```js
// connect
const token = await client.token.create({
  data: {
    payload: "uniqe string",
    user: {
      connect: {
        id: user.id,
      },
    },
  },
});

// connectOrCreate
const token = await client.token.create({
  data: {
    payload: "uniqe string",
    user: {
      connectOrCreate: {
        where: {
          ...payload,
        },
        create: {
          name: "Anonymous",
          ...payload,
        },
      },
    },
  },
});
```
### Relation between Models Example
* `schema.prisma` 파일
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String?  @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tokens    Token[]
}

model Token {
  id        Int      @id @default(autoincrement())
  payload   String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```
  * User.id === Token.userId
  * `onDelete: Cascade` 옵션으로 User를 지우면 연결된 Token도 지워짐
* api 코드 중
  ```js
  const info = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true },
  });
  ```
  * token 정보를 가져올 때, user 정보도 함께 가져오고 싶으면 `include` 옵션 사용하기
### seeding
* DB에 가짜 데이터를 빠르게 생성 가능
* 사용 방법
  1. prisma/seed.ts 파일 생성
  2. package.json 에 아래 추가후 `
    ```json
      "prisma": {
        "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma\\seed.ts"
      }
    ```
  3. `npx prisma db seed` 명령어 실행
### [Connection Pool](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pool)
* DB에 동시 접속을 얼마나 할지 정할 수 있음
### 쿼리 조회
```js
const client = new PrismaClient({log: ["query"]});
```

## [PlanetScale](https://planetscale.com/)
* MySQL과 호환되는 serverless DB platform
  * DB platform : they give you DB
  * serverless : we don't have to manage, maintain, secure, upgrade and those things for a server
  * **MySQL-compatible** 
  * downtime : db가 꺼지지 않음
* **[Vitess](https://vitess.io/)** 를 사용함
  * Scalable. Reliable. MySQL-compatible. Cloud-native. Database.
  * High Availability : db의 복사본을 저장 (replica)
  * 대량의 connections, tables와 다양한 서버들을 scaling 가능
    * 즉, DB를 잘게 쪼개서 여러 서버에 분산시키는 데에 특화되어 있음
  * MySQL에는 있지만 Vitess 없는 몇가지 (Because It's MySQL-compatible. It's **not** a MySQL server platform!!)
    * foreign key Constraint (하지만, prisma를 통해 확인 가능)
      ```prisma
      datasource db {
        provider     = "mysql"
        url          = env("DATABASE_URL")
        relationMode = "prisma"
      }
      ```
      <details>
      <summary>Preview feature "referentialIntegrity" is deprecated.</summary>

      ```prisma
      generator client {
        provider        = "prisma-client-js"
        previewFeatures = ["referentialIntegrity"]
      }

      datasource db {
        provider             = "mysql"
        url                  = env("DATABASE_URL")
        referentialIntegrity = "prisma"
      }
      ```
      </details>
### Install
* [CLI](https://github.com/planetscale/cli#installation)
  * 좋은 개발자 경험 (DX) 제공
  * create Branch for DB (like git)
  ```shell
  # PowerShell (version 5.1 or later)
  > Set-ExecutionPolicy RemoteSigned -Scope CurrentUser # Optional: Needed to run a remote script the first time
  > irm get.scoop.sh | iex
  > scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
  > scoop install pscale mysql
  > pscale auth login
  > pscale region list # check a region (ap-northeast)
  > pscale database create carrot-market --region ap-northeast # https://app.planetscale.com/emmayoo9663/carrot-market
  > pscale connect carrot-market # secure tunnel
  ```
  * `pscale connect` 명령어
    * secure tunnel
    * 실제 password를 .env 등 파일에 저장하지 않고도, 컴퓨터와 PlanetScale 연결 가능
    * MySQL을 2번 설치할 필요 없음 (컴퓨터용 & PlanetScale용)
    * 단, 명령어 실행 후 터미널을 켜놓고 있어야 함
      <details>
      <summary>다시 접근하는 방법</summary>

      ```
      > dir ~\scoop
      > cd .\shims
      > ./pscale connect carrot-market
      ```
      </details>
### Etc
<details>
<summary>account</summary>

```
emmayoo9663@gmail.com
B!1~6
```
</details>

## React Hook Form (v7)
* Less code, Better validation, Better Errors (set, clear, display)
* Don't deal with events
* Have control over inputs
* Easier Inputs
### [useForm](https://react-hook-form.com/api/useform/)
```js
const { register, watch, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>({
  mode: "onSubmit", // onSubmit (Default), onChange, onBlur
  // defaultValues: {}
});
```
### RegisterOptions
* HTML에서도 제공하는 옵션 포함
* `validate` : customized validation
  ```js
  validate: {
    notAllowedGmail: (value) =>
      !value.includes("@gmail.com") || "gmail is not allowed",
  },
  ```
### Install
* `npm i react-hook-form`

## [Twilio](https://ahoy.twilio.com/)
* SMS 보내기, robocall 또는 폰 번호를 숨기기 등 다양한 기능 제공
* `npm install twilio`
### Etc
<details>
<summary>account</summary>

```
emmayoo9663@gmail.com
B!1~6
```

## [SendGrid](https://sendgrid.com/solutions/email-api/)
* Email 보내기
* 계정은 Twilio와 동일함
* `npm install --save @sendgrid/mail`
* **쓰려다 실패해서 nodemailer로 변경** (nodemailer 네이버 연동 참고)

## [iron session](https://github.com/vvo/iron-session)
* 서명, 암호화된 쿠키를 사용하는 NodeJS 무상태 세션 도구
* backend에서 iron session을 설정하여 authentication(인증) 가능
* 사용자에게 암호화된 쿠키를 주고, 사용자는 요청을 보낼 때 받은 쿠키를 함께 보내서 인증 가능
### 장점
1. JWT 가 아님
  * JWT는 user 객체와 그 안에 signature를 함께 보내서 사용자를 신뢰할 수 있는지 보는 것. user 객체를 확인 가능
    * { user: 1 } => { user:1, signature: abc }
  * iron session은 user 객체를 암호화한 값을 쿠키로 주고 받아 복호화하여 사용. user 객체 확인 불가능. 따라서, 여러 정보를 넣을 수 있음
    * { user: 1 } => abadfstefjlsg => { user: 1 }
2. 백엔드를 구축할 필요가 없음
  * api handler를 `withIronSessionApiRoute`로 감싸주면, iron session이 알아서 요청 객체 안에 session user를 보내줌
    * `req.session`으로 접근 가능

## [NextAuth.js](https://next-auth.js.org/)
* Next.js에서 authentication 구현을 도와주는 package
* 사용자 로그인 여부를 알려주는 hook과 function 등을 제공
  * carrot market 강의에서 쓰지 않음 (대신, iron session과 SWR을 사용하여 직전 구현)
* custom하기 조금 까다로움
* 바로 앱 만들기 좋음
* DB 필요 없음
  * 어떤 사용자가 로그인되었는지 모르지만 로그인 여부는 알 수 있음
* prisma와 연결 [방법](https://authjs.dev/reference/adapter/prisma)
  * PrismaAdapter 필요함
  * 필수로 있어야하는 model schema 작성해야함

## SWR (Stale-While-Revalidate)
* HTTP 캐시 무효화 전략
* 페이지 다시 진입하면 캐시에 있는 데이터를 먼저 보여주고, 뒤에서 API를 요청하여 데이터가 이전과 변경이 있으면 화면과 캐시 업데이트
* SWR을 사용하면 컴포넌트가 데이터의 변경을 계속 다종으로 감지할 수 있음
  * UI 변경이 빠름
  * 최신 데이터 반영
  * 로딩표시기 없음
* 데이터를 불러오는 작업을 위한 여러 hooks를 가짐
* NextJS를 만든 사람이 만듦
* `npm install swr`
### useSWR
* useSWR(key, fetcher)
  * key : API url & cache key
  * fetcher : useSWR의 첫번째 인자 값이 fetcher 함수의 첫번째 인자로 넘어감
* 사용자가 브라우저의 다른 탭으로 다시 돌아왔을 때 데이터를 새로고침 (재조회)
### SWRConfig : Global Configuration
* 모든 페이지에 적용되어 fetcher와 같은 기본값을 지정할 수 있는 provider
### mutate
* [bound-mutate](https://swr.vercel.app/docs/mutation#bound-mutate) 을 사용하여 **Optimistic UI Update** 구현 가능
  * 예를 들어, `mutate({ ...data }, true)`
  * 첫번째 arg는 업데이트 될 캐쉬 데이터
  * 두번쨰 인자는 캐쉬 업데이트 후 백엔드에 요청을 통해 검증하는 용도로 (default: true)

## Cloudflare
* 고정된 가격만 청구함 [참고](https://www.cloudflare.com/products/cloudflare-images/)
  * Pay only for images stored and served Images are priced at $5 per 100,000 images stored and $1 per 100,000 images delivered — with no egress costs or additional charges for resizing and optimization.
  * egress costs : 대역폭(bandwidth)에 요금을 내야 하는 것
  * 이미지 리사이징이나 최적화에도 추가 요금 없음
  * 따라서, 큰 이미지를 업로드해도 무료로 원하는 크기로 리사이징 해줌
### Upload images
1. Images dashboard - 관리자 권한이 있는 사람만 쓸 수 있음 (불편함)
2. API token - 사용자와 클라우드 사이에서 이미지를 주고 받을 서버가 필요함 (하지만, 우리는 serverless!)
3. Direct Creator Upload (*) - 사용자와 클라우드 사이에 서버는 있음. 단지, 이 서버의 역할은 사용자가 파일 업로드 했는지를 CF에 알리고, CF에게서 받은 empty file URL을 돌려주는 역할. 사용자는 이 URL에 파일을 업로드함.
### Image Resizing
* Cloudflare가 url을 바탕으로 resizing 해줌
  * 일반적으로는, 사용자가 이미지를 업로드할 때 자동으로 이미지를 여러 버전으로 리사이징 함
* [Variants](https://dash.cloudflare.com/c11241038b0fc4ccc653ed4b84cb170b/images/variants)
  * 기본적으로 이미지의 variant는 **public**임
  * fit - scale down: w:h 비율 유지, crop: 지정한 w*h으로 자름

## Tips
### icons
* [heroicons](https://heroicons.com/)
### <label> tag "htmlFor" attribute
  ```html
    <label htmlFor="price">price</label>
    <input id="price"></div>
  ```
### <div>
* 가운데 정렬하기 위한 조건
  * width 설정
  * display: block
  * margin: auto
### form in React without library
  ```js
  const onInputChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { currentTarget: { value } } = event;
    setInputValue(value);
  };
  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputValue === "") setErrorMessage("It is required");
      // ...
    };
  ```
  ```html
  <input type="text" minLength=3 required />
  ```
  * minLength와 required는 html의 validation으로 개발자 도구에서 지우면 유효성 검사하지 않는 문제 발생
### Content-Type
* request.body는 request 내용의 인코딩을 기준으로 parse 됨
```js
// fetch
fetch("/api/users/enter", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
});

// api
...
req.body.email // Content-Type이 없는 경우, undefined 반환됨
```
### prisma error 중 
* Argument phone: Got invalid value '01012345678' on prisma.findUniqueUser. Provided String, expected Int.
```js
user = await client.user.findUnique({ where: { phone: +phone } });
if (!user) {
  user = await client.user.create({
    data: {
      name: "Anonymous",
      phone: +phone,
    },
  });
  console.info(user);
}
```
### Optimistic UI Update
* 요청이 정상적으로 수행될 것이라 생각하고, UI 변경하기 (성공 응답 기다리지 않음)
### Pagenation
* Planet Scale는 DB를 읽고 쓰기에 따라 금액이 다름
* 따라서, Prisma를 통해 쉽게 필요한 데이터만 조회 가능
  * `take` & `skip`
  * 단순 조회 (findUnique) 뿐만 아니라, 관계 조회 (include)에서도 사용 가능
### 브라우저 이미지
* 브라우저(JS)는 내 컴퓨터 파일에 접근 불가능
* 즉, 내가 업로드한 파일만 접근 가능 (브라우저의 메모리에 있는 파일을 얻을 수 있음)
  ```ts
  const file = img[0] as FileList;
  const url = URL.createObjectURL(file);
  console.info(url);
  ```
### `<Image />` 컴포넌트 오류
* NextJS가 도메인 이름을 알 필요가 있다는 오류
* 오류 내용
```
Error: Invalid src prop (https://imagedelivery.net/aPDiyG044pHV2EO8w7d39Q/33b14925-6f79-40d0-e336-cbf2c3bb1d00/avatar) on `next/image`, hostname "imagedelivery.net" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
```
