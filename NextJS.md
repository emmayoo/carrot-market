# Middlewares
* NextJs는 serverless
  * server 파일 당연히 없음
  * middleware 함수를 어떻게 넣을 수 있을까?!
* MW는 페이지 로딩 전에 실행됨
  * 당연히 api 요청도 보내지 않음
* **return** 하는 것 잊지 않기!
## _middleware.ts 파일
* **`_middleware.ts`** 를 **/pages** 폴더 하위에 있는 원하는 scope(폴더)에 넣기
  * 예를 들어, `/pages/_middleware.ts` 라면, 페이지 이동하거나 api 요청할 때마다 적용됨
	```ts
	import type { NextRequest, NextFetchEvent } from "next/server";

	export function middleware(req: NextRequest, ev: NextFetchEvent) {
		console.log(req.ua);
	}
	````
## Examples
* user가 bot이면 막기
* 로그인 안 되어 있을 때 (쿠키에 carrotsession 없음), 로그인 화면으로 이동
  ```ts
	import type { NextRequest, NextFetchEvent } from "next/server";
	import { NextResponse } from "next/server";

	export function middleware(req: NextRequest, ev: NextFetchEvent) {
		if (req.ua?.isBot) {
			return new Response("Plz don't be a bot. Be human.", { status: 403 });
		}
		if (!req.url.includes("/api")) {
			if (!req.url.includes("/enter") && !req.cookies.carrotsession) {
				return NextResponse.redirect("/enter");
			}
		}
		// console.log(req.geo); // local에서는 작동하지 않음 (배포 후 호스팅 제공업체에 따라 작동하기 때문) (국가에 따라 처리 가능)
		// return NextResponse.json({ ok: true });
	}
	```

# Dynamic Imports
* NextJS 앱의 로딩 시간을 최적화할 수 있음
```ts
import dynamic from "next/dynamic";
...
const Bs = dynamic(() => import("@components/bs"), { ssr: false });
...
<Bs />
```
* 파일이 정말 필요할 때 로딩 가능
  * 최상단에 import된 파일은 렌더가 안 되더라도 import되는 문제가 있음
* 앱을 다 만들고 최적화 할 때 dynamic import 추가하는 것을 추천
  * 타입 에러로 고생할 수 있음
  * 정말 필요한지 확인하면서 성능 최적화 가능
  * 개발 속도가 늦춰지는 것을 방지
## Options 
* `ssr: false` 옵션
  * 서버단에서 로딩하지 않게 설정 가능 (클라이언트에서만 로딩할 수 있게 설정)
  * NextJs는 기본적으로 서버단에서 일반 HTML로 export
  * 몇몇 라이브러리는 서버단에서 로딩이 불가능한 경우가 있음 (에러 발생)
* `loading: () => <LoadingComponent />`
  * Lazy-load Imports
  * Dynamic Import하는데 오래 걸리는 경우 (파일 크기가 큼, 인터넷 느림)
* `suspense: true` & `<Suspense />`(in react 18)
  * loading 옵션 대신 react의 Suspense 컴포넌트 사용 가능
  * Suspense가 있으면 useSWR hook의 loading status는 더 이상 필요 없음

# _document and Fonts
## document component vs app component
* 비슷한 점
  * app component는 NextJS가 앱을 build 할 때 앱 전체의 청사진과 같은 것
* 다른 점
	* app component는 사용자가 페이지를 불러올 때마다 브라우저에서 실행 됨
  * **document component는 서버에서 한 번만 실행 됨**
    * SEO를 위한 사이트맵 추가, 네이버 인증 등의 작업은 여기서 하기
    * 검색 엔진 크롤러나 봇이 사이트에 도착하자마자 해당 파일의 html이 이미 준비되어 있다는 의미
## _document
* `pages/_document.tsx`
```tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
// export default class Document {
	render(): JSX.Element {
		return (
			<Html lang="en">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
```
### `<Main />`
  * 컴포넌트에 app component가 들어감
### `<NextScript />`
  * JS 를 import할 때도 NextJS가 최적화해 줌
  * 예를 들어, GA JS, kakao SDK 등
## Fonts
* 최적화
  * Google font 써야 함 (NextJS의 폰트 최적화는 Google font에서 제공하는 font를 기반으로 함) 
  * 폰트 url에 가서 다운로드 받는데, NextJS는 이걸 최적화하는 것
  * 최적화는 빌드 시간에 됨 (**개발 모드에서는 안 됨**)
```jsx
<Html lang="ko">
	<Head>
		<link
			href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
			rel="stylesheet"
		/>
	</Head>
	<body>
		<Main />
		<NextScript />
	</body>
</Html>
```
## `<Script />` 컴포넌트 (in app component)
```tsx
<Script
	src="https://developers.kakao.com/sdk/js/kakao.js"
	strategy="lazyOnload"
	onLoad={function(){}}
/>
```
* strategy
  1. beforeInteractive : 페이지를 다 불러와서 상호작용 하기 전에 스크립트 불러옴 (하지만, 대부분의 경우 페이지가 로딩되기 전에 script를 불러올 필요가 없음)
  2. afterInteractive
  3. lazyOnload : 나중에 불러와도 되는 기능 만들 때 좋음 (예, 좋아요 개수)
* **onLoad**

# Data Fetching
## getServerSideProps
* SSR로 페이지 렌더링
* prop으로 데이터 받을 수 있음
  * 단, export default를 한 클래스로 전달됨
* 페이지 로딩 없음 (데이터 다 준비후 렌더링)
  * 페이지 보기
* useSWR 사용하지 않아도 됨
  * useSWR을 쓰면 탭 이동 시 새로고침되는데, 이 기능을 더 이상 쓸 수 없음
  * 하지만, SSR + SWR 방법이 있음
* api는 GET 요청을 제외하고, api 핸들러 만들어 쓸 수도 있음
* 문제점
  * static optimization이나 cache 같은 걸 사용할 수 없음! (매번 새로 조회)
  * 데이터 조회에 오류가 나면, 사용자는 빈 화면을 보게됨 (기본 틀 없음)
### SSR + SWR
* 어떡하면 getServerSideProps의 보안성과 SWR의 멋진 기능을 같이 쓸 수 있을까?
* SWRConfig 컴포넌트의 fallback prop으로 캐시 초기값을 설정 가능
  * 혹시 모를 일 대비 OR 탭 이동 시 캐시 값 보여줄 수 있음
* fallback의 key 값은 SWR의 key 값
* 페이지는 Server Side Rendering되지만, Client에서 페이지가 열릴 때 useSWR이 백그라운드에서 요청을 보내 가장 최신 데이터를 불러옴
* 양쪽의 장점을 살릴 수 있는 방법
### SSR + Authentication
```ts
import { withIronSessionSsr } from 'iron-session/next';
// redering 할 때, NextJS의 SSR에서 session을 받오는 함수
export const withSsrSession = (fn: any) => {
	return withIronSessionSsr(fn, cookieOptions);
};
```
## getStaticProps
* 정적 사이트를 만들어 줌
* build 시점에 한 번만 실행됨
* remark-html 
  * HTML serializing 지원을 추가하는 remark 플러그인
  * `npm i remark-html remark-parse unified`
  ```js
	import matter from "gray-matter";
	import remarkHtml from "remark-html";
	import remarkParse from "remark-parse";
	import { unified } from "unified";
	...
	export const getStaticProps: GetStaticProps = async (ctx) => {
		const { content } = matter.read(`./posts/${ctx?.params?.slug}.md`);
		const { value } = await unified()
			.use(remarkParse)
			.use(remarkHtml)
			.process(content);
		return {
			props: { post: value }, // value: string = "<h1>문자열</h1>"
		};
	};
	...
	```
	* `<div dangerouslySetInnerHTML={{ __html: post }} />;`
### gray-matter
* Parse front-matter from a string or file (YAML, JSON, TOML, MD)
* `npm install --save gray-matter`
## getStaticPaths
* static page를 미리 생성하기 위함
* **동적 URL이 있는 페이지에서 getStaticProps를 쓸 때 필요**
* 얼마나 많은 정적 페이지가 있는지 NextJS에게 알려줌
* 예를 들어, 블로그 글 & md 파일 읽어서 페이지 만들기 등
* 
### fallback
1. `fallback: false`
	* 빌드 시에만 한 번 HTML 생성
2. `fallback: "blocking"`
   * 사용자의 요청에 따라 정적 페이지를 만들어야 할 때 사용 가능
   * pre-generate할 수 없는 경우 (예를 들어, dynamic url이 DB 등에서 조회해야 하거나, 자주 바뀌거나, 데이터가 많은 경우)
   * 페이지 진입 시, 미리 만들어진 HTML이 없으면 getStaticProps가 SSG를 작동하여 렌더링하고, 유저는 화면을 볼 수 있음
     * 하지만, 페이지 생성하는 동안에 유저는 화면을 볼 수 없음
   * **초기 진입 시 html 생성시 시간이 걸리고, 이후에는 빌드된 파일을 바로 보여주기 때문에 빠름**
   * `npm run build`시 예를 들어 `.next/server/pages/products` 에 html이 없다가 해당 페이지 진입 시, dynamic url에 맞게 html 생성됨
   * 서버 사이드 렌더링 + 최초 한 번만 생성
   ```js
   export const getStaticPaths: GetStaticPaths = () => {
     return {
       paths: [],
       fallback: "blocking",
     };
   };
   ```
* `fallback: true`
  * 페이지 생성하는 동안에 유저가 화면을 볼 수 있도록 함
  * 페이지가 생성되면, 화면 갈아끼우기
  ```js
	if (router.isFallback) {
    return (
      <Layout title="Loaidng for youuuuuuu">
        <span>I love you</span>
      </Layout>
    );
  }
	return (<Layout> ... </Layout>)
	```
## Recap
* 페이지를 렌더링할 수 있는 방법
  1. 완전히 서버단에서 렌더링 (getServerSideProps)
    * 장 : 로딩표시기 없음
    * 단 : 데이터를 전부 불러올 때까지 유저는 빈 화면 보게 됨
  2. 초기 state로 HTML 생성 + api 데이터 조회 (NextJS 기본 방법)
    * 장 : 초기 state로 초기 화면은 볼 수 있음
    * 단 : 데이터 조회가 오래 걸릴 수 있음
  3. build 시, 정적 페이지 만들기 (getStaticProps)
	  * 데이터 변경이 있으면, 빌드를 새로 해야함
# [Incremental Static Regeneration (ISR)](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
* 단계적 정적 재생성
* 페이지에 로딩 상태가 전혀 나타나지 않고, 서버단에서 페이지를 렌더링하지 않아도 됨
```js
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}
```
  * 맨 처음 요청 이후와 10초 이전의 요청은 캐싱되며 즉시 유저에게 제공됨
* `npm run build` & `npm run start` 로 서버 켜서 확인하기!!
## [On-demand Revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation)
* 수동으로 getStaticProps를 어디에서든 작동시킬 수 있음
* api 핸들러에서 trigger 가능
