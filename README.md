# carrot-market
* 노마드코더 [[풀스택] 캐럿마켓 클론코딩](https://nomadcoders.co/carrot-market) 강의 프로젝트
* 언어: Next.JS, Prisma, Tailwind, Serverless
* 프론트엔드 & 백엔드: NextJS (+Serverless)
* 디플로이: Vercel


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

## About NextJS Framework
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

## Tailwind
### class 
* flex + [space](https://tailwindcss.com/docs/space)
* 클래스명 앞에 음수 붙이면 음수값
  * 예를 들어, `top-[-5px]`와 `-top-[5px]` 같음
* [min-h-screen](https://tailwindcss.com/docs/min-height#setting-the-minimum-height)
* [aspect-square](https://tailwindcss.com/docs/aspect-ratio#browser-support)
* [ring](https://tailwindcss.com/docs/ring-width)
  ```jsx
    <button className="w-5 h-5 rounded-full bg-yellow-500 focus:ring-2 ring-offset-2 ring-yellow-500 transition" />
  ```
  * 'focus' modifier를 ring-2에만 쓴 이유 ? ring-offset-2와 ring-yellow-500은 variable일 뿐임
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