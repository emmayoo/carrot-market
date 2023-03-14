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
* `pages/api` 하위에 api 파일 넣기 (따라서, 백엔드를 위한 서버 구축하지 않아도 됨)
* Api Routes를 위한 규칙은 connection handler 함수를 **export default** 하면 됨
* function은 무조건 export default하기 (그렇지 않으면, 작동하지 않음)
* url에 접근 시, NextJS가 실행할 function을 return하는 function을 만들어야 함
* NextJS는 req와 res를 제공

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
