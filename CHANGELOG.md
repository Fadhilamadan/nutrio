# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 1.5.0 (2026-06-20)


### Features

* AI JSON enforcement, settings redesign, and form validation improvements ([#1](https://github.com/Fadhilamadan/nutrio/issues/1)) ([fc2db00](https://github.com/Fadhilamadan/nutrio/commit/fc2db00bdd097cb6f4b564ceeca22363f4207e6e))
* **ai:** add retail product disambiguation to prompt ([1f2434d](https://github.com/Fadhilamadan/nutrio/commit/1f2434dcf24b03635e67413e145532a747a4415e))
* **analyze:** add API-key onboarding banner and secure localStorage cleanup ([#2](https://github.com/Fadhilamadan/nutrio/issues/2)) ([b457edb](https://github.com/Fadhilamadan/nutrio/commit/b457edb435d280161b2926ab03bafa93df67600d))
* **analyze:** optional food description context and halal dietary guidelines ([#3](https://github.com/Fadhilamadan/nutrio/issues/3)) ([985767c](https://github.com/Fadhilamadan/nutrio/commit/985767c09571f27ecdb70c23b45264acd06d7a52))
* **api:** fall back to default token when no apiKey ([181fa46](https://github.com/Fadhilamadan/nutrio/commit/181fa46dc34c395e9731c969e90f03031445865a))
* **app:** integrate free trial across all screens ([f78d44a](https://github.com/Fadhilamadan/nutrio/commit/f78d44a823c0c93f30e65092577b8c53edffc65e))
* **hook:** add useDefaultUsage for free trial tracking ([c131f89](https://github.com/Fadhilamadan/nutrio/commit/c131f8986fe487212d1c2636bed6cc31caa1d1ab))
* initial app ([13b3741](https://github.com/Fadhilamadan/nutrio/commit/13b374114613ee39c2f9f0244bfb496b10bd2d2f))
* **lib:** make apiKey optional for default token support ([e987f52](https://github.com/Fadhilamadan/nutrio/commit/e987f529a53a0b686e91f3f1f45d266ef96137cd))
* **ui:** add DefaultTokenBanner component ([868bdde](https://github.com/Fadhilamadan/nutrio/commit/868bdde95608564b81984309d62fd258ff0734ea))


### Bug Fixes

* animation, accessibility, and cleanup improvements ([#4](https://github.com/Fadhilamadan/nutrio/issues/4)) ([69058b4](https://github.com/Fadhilamadan/nutrio/commit/69058b4df911a9fb87df2449604c8d765ec36bea))
* **footer:** remove surface-soft bg to avoid box in dark mode ([bff0540](https://github.com/Fadhilamadan/nutrio/commit/bff0540d40f7b24a2157723c8f4df4ce9c92d31e)), closes [#22211](https://github.com/Fadhilamadan/nutrio/issues/22211) [#10100](https://github.com/Fadhilamadan/nutrio/issues/10100)
* **free-trial:** persist usage counter across logouts, add console.warn ([994fd1c](https://github.com/Fadhilamadan/nutrio/commit/994fd1cf1a5e564ed493376bf16b8255b18769b6))
* persist analyze screen in sessionStorage across page reload ([8fbbc0a](https://github.com/Fadhilamadan/nutrio/commit/8fbbc0adf521053f18a240f3a964048ad22b8f5f))
* **settings:** stop save errors from triggering global ErrorCard ([0261c97](https://github.com/Fadhilamadan/nutrio/commit/0261c97fbc981a2f6b21a3df84d0d0b4ab572547))

## 1.4.0 (2026-06-18)


### Features

* add zod validation with logical range bounds ([464903f](https://github.com/Fadhilamadan/nutrio/commit/464903f1955f1b451679883156f1d2615194c80a))
* AI JSON enforcement, settings redesign, and form validation improvements ([#1](https://github.com/Fadhilamadan/nutrio/issues/1)) ([fc2db00](https://github.com/Fadhilamadan/nutrio/commit/fc2db00bdd097cb6f4b564ceeca22363f4207e6e))
* **analyze:** add API-key onboarding banner and secure localStorage cleanup ([#2](https://github.com/Fadhilamadan/nutrio/issues/2)) ([b457edb](https://github.com/Fadhilamadan/nutrio/commit/b457edb435d280161b2926ab03bafa93df67600d))
* **analyze:** optional food description context and halal dietary guidelines ([#3](https://github.com/Fadhilamadan/nutrio/issues/3)) ([985767c](https://github.com/Fadhilamadan/nutrio/commit/985767c09571f27ecdb70c23b45264acd06d7a52))
* initial app ([13b3741](https://github.com/Fadhilamadan/nutrio/commit/13b374114613ee39c2f9f0244bfb496b10bd2d2f))
* **landing:** add FAQ accordion section to landing page ([5ccec2a](https://github.com/Fadhilamadan/nutrio/commit/5ccec2ab3e6a0d171c7365869438c93e3e0d5597))
* remove reminder and notification feature ([d0aa1eb](https://github.com/Fadhilamadan/nutrio/commit/d0aa1eb3c94c36636bf25ed41a4cb4d519dfa310))
* **settings:** add per-provider API key tutorial with model reference links ([2d583cf](https://github.com/Fadhilamadan/nutrio/commit/2d583cfe58ae8b74de4f07417e86d3557a162087))


### Bug Fixes

* **anim:** replace height animation with grid-template-rows in target calculator ([049c899](https://github.com/Fadhilamadan/nutrio/commit/049c899fc9704094ec2fe6d6b70c1ddf84e68ccb))
* **auth:** add explicit cookie config and jwt callbacks ([9d69064](https://github.com/Fadhilamadan/nutrio/commit/9d69064a93502dc537b8b217df3cd703d2d9c132))
* **deps:** resolve npm audit vulnerabilities in postcss and uuid ([9201eaf](https://github.com/Fadhilamadan/nutrio/commit/9201eaf86d91c0df1a96395d34bc34f2f30386ae))
* **pwa:** improve iOS appearance and remove blur from nav ([bc03001](https://github.com/Fadhilamadan/nutrio/commit/bc03001be0cf8b07aeb77382c493c1ac6a45ed5a))
* **settings:** switch default AI provider from OpenRouter to Groq ([83d9cdd](https://github.com/Fadhilamadan/nutrio/commit/83d9cdd35f22866b5f9578f959221b96ba7cae66))

## 1.3.0 (2026-06-17)


### Features

* AI JSON enforcement, settings redesign, and form validation improvements ([#1](https://github.com/Fadhilamadan/nutrio/issues/1)) ([fc2db00](https://github.com/Fadhilamadan/nutrio/commit/fc2db00bdd097cb6f4b564ceeca22363f4207e6e))
* **ai:** add foodDescription plumbing through types, validation, and API ([052eae4](https://github.com/Fadhilamadan/nutrio/commit/052eae401420755cf53a8ec91368bc1b21211423))
* **ai:** wire foodDescription through all five AI providers ([7268a99](https://github.com/Fadhilamadan/nutrio/commit/7268a9962e48af558c91be62e008cff669b510b3))
* **analyze:** accuracy banner and sonner toasts ([bddbcd0](https://github.com/Fadhilamadan/nutrio/commit/bddbcd02b4b6c0e080449fb142512902a0d85bf5))
* **analyze:** add API-key onboarding banner and secure localStorage cleanup ([#2](https://github.com/Fadhilamadan/nutrio/issues/2)) ([b457edb](https://github.com/Fadhilamadan/nutrio/commit/b457edb435d280161b2926ab03bafa93df67600d))
* **analyze:** add optional food description textarea for advanced context ([22f2e9d](https://github.com/Fadhilamadan/nutrio/commit/22f2e9dff9c6297d013c460ba69e548eacbf347b))
* **analyze:** textarea for serving/items/notes, accuracy text in result editor ([d0c471b](https://github.com/Fadhilamadan/nutrio/commit/d0c471bcde902f0bf434dda7c7005b882e5709bc))
* **history:** sonner toast for archive and edit, dirty-disable save ([3823a59](https://github.com/Fadhilamadan/nutrio/commit/3823a599f1bc9b7cfbe9d8e5f35651f3b5c2b032))
* **history:** textarea for serving estimate, food items, notes ([7b32963](https://github.com/Fadhilamadan/nutrio/commit/7b32963582e4906bb07cdf921eebcfa0eb8ce6e4))
* initial app ([13b3741](https://github.com/Fadhilamadan/nutrio/commit/13b374114613ee39c2f9f0244bfb496b10bd2d2f))
* **landing:** add marketing landing page before auth gate ([85f0c30](https://github.com/Fadhilamadan/nutrio/commit/85f0c308764bc995babaa1743ad22964587925e4))
* **prompt:** add halal dietary guidelines to AI prompt ([21df223](https://github.com/Fadhilamadan/nutrio/commit/21df223e2fd0f1abd98a418c992cd144068b2571))
* **settings:** sonner toast, dirty-disable save button ([b26d132](https://github.com/Fadhilamadan/nutrio/commit/b26d132924f51829d7bfdde72c0883fd2d9a8268))
* **targets:** Martin Berkhan calculator, bodyfat input, save toast ([746f05d](https://github.com/Fadhilamadan/nutrio/commit/746f05dea54291d0160436534f75c4b31ed11a87))
* **ui:** hide floating camera button on devices without a camera ([a9ad2ff](https://github.com/Fadhilamadan/nutrio/commit/a9ad2ffafd3f166d132d8f5b7af2ecb5c02eec65))


### Bug Fixes

* **analyze:** disable camera button on desktop, keep floating button visible ([e692d03](https://github.com/Fadhilamadan/nutrio/commit/e692d039687fef2f8d801e808fa80f3885e9a299))
* **analyze:** normalize provider auth errors to a clear message ([fcac0df](https://github.com/Fadhilamadan/nutrio/commit/fcac0df936b8ed195297da563d4c8ed7955e0b86))
* **auth:** stop clearing API keys on transient session flicker ([bc8f1ae](https://github.com/Fadhilamadan/nutrio/commit/bc8f1ae0c269ace63ef580adcbf5b038830049ca))
* **profile:** cap avatar initials to first and last name ([e12a48b](https://github.com/Fadhilamadan/nutrio/commit/e12a48b8697ea2d4f8a86b613f3a7dfae9a14aeb))
* **targets:** move split badge to calculator, simplify description ([4f6cc0e](https://github.com/Fadhilamadan/nutrio/commit/4f6cc0e5f37d310a02522454c6ff79d7f1edfecd))
* **ui:** hide floating camera button on non-touch devices ([e4d6fc2](https://github.com/Fadhilamadan/nutrio/commit/e4d6fc29bb9672d84eba3bd3a7ee9a1b45c224de))

## 1.2.0 (2026-06-16)


### Features

* AI JSON enforcement, settings redesign, and form validation improvements ([#1](https://github.com/Fadhilamadan/nutrio/issues/1)) ([fc2db00](https://github.com/Fadhilamadan/nutrio/commit/fc2db00bdd097cb6f4b564ceeca22363f4207e6e))
* **analyze:** add API-key-required banner with navigate to settings ([e09b9cb](https://github.com/Fadhilamadan/nutrio/commit/e09b9cbd6f242d7a34c254413eaf58a58ec8f83a))
* initial app ([13b3741](https://github.com/Fadhilamadan/nutrio/commit/13b374114613ee39c2f9f0244bfb496b10bd2d2f))
* **settings:** replace API key password input with textarea ([35a7417](https://github.com/Fadhilamadan/nutrio/commit/35a741705a72d80571fa61737cf6e0a8c9e1f2f2))
* **ui:** add global license footer and align with CC BY-NC-SA 4.0 ([f6b29b6](https://github.com/Fadhilamadan/nutrio/commit/f6b29b61d104760af2f9758e83f695ca4745ff2c))


### Bug Fixes

* clear API keys from localStorage on logout and session expiry ([2f67bd5](https://github.com/Fadhilamadan/nutrio/commit/2f67bd5df222a3783ed23afb8037f837d6f1b58a))

## 1.1.0 (2026-06-15)


### Features

* **analyze:** add validation, dirty state, and save flow improvements ([03bcb38](https://github.com/Fadhilamadan/nutrio/commit/03bcb389d46ddf843c655e33b511ec5d5da31cac))
* **api:** add /api/settings/defaults endpoint ([f87d240](https://github.com/Fadhilamadan/nutrio/commit/f87d2405d279d4566b1894e8f8572ad348740294))
* **date:** add displayMealTime helper for local AM/PM time ([2328942](https://github.com/Fadhilamadan/nutrio/commit/2328942ed80adc5d93df4306d19d619d5e665875))
* **history:** add field validation and unsaved pulse indicator on edit form ([19cfc6d](https://github.com/Fadhilamadan/nutrio/commit/19cfc6d95e4cb2587497e35084166898daad1c51))
* initial app ([13b3741](https://github.com/Fadhilamadan/nutrio/commit/13b374114613ee39c2f9f0244bfb496b10bd2d2f))
* **settings:** redesign with accordion groups and validation ([0e68ef5](https://github.com/Fadhilamadan/nutrio/commit/0e68ef5b9f2f4216c4e0822586a026ddd54e5538))
* **targets:** improve form UX with validation, unsaved indicator, and iOS fix ([ce69799](https://github.com/Fadhilamadan/nutrio/commit/ce69799ed1d855afcbc1d9ad475bdaedd86d7fb3))


### Bug Fixes

* **ai:** enforce JSON output via API-level constraints and food ID guide ([f3ff87d](https://github.com/Fadhilamadan/nutrio/commit/f3ff87dff4d11a362329a9e758cebc94da6ce70f))
* **ai:** tighten prompt and parser for reliable JSON output ([cd8300f](https://github.com/Fadhilamadan/nutrio/commit/cd8300fa90568574116582d554528b169dbf8244))
* **dashboard:** allow name to wrap, remove truncate ([6948410](https://github.com/Fadhilamadan/nutrio/commit/6948410902c4ad40450b29323c6af38af4ba8122))
* **settings:** handle iOS notification and PWA limitations ([4ed48bb](https://github.com/Fadhilamadan/nutrio/commit/4ed48bb84517020f050e2168dbbd3b798397574f))

## 1.0.0 (2026-06-15)

### Features

- initial app ([13b3741](https://github.com/Fadhilamadan/nutrio/commit/13b374114613ee39c2f9f0244bfb496b10bd2d2f))
