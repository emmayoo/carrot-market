# carrot-market
* 노마드코더 [[풀스택] 캐럿마켓 클론코딩](https://nomadcoders.co/carrot-market) 강의 프로젝트
* 언어: Next.JS, Prisma, Tailwind, Serverless
* 프론트엔드 & 백엔드: NextJS (+Serverless)
* 디플로이: Vercel


## Install
### NextJS + Typescript
* `npx create-next-app@latest --typescript`
* React 18
### tailwind
* `npm install -D tailwindcss autoprefixer`
* `npx tailwind init -p`
  * Created Tailwind CSS config file: tailwind.config.js
  * Created PostCSS config file: postcss.config.js
* Global Styles in NextJS
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