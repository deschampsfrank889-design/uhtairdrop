
import { updateAppConfig } from '#app/config'
import { defuFn } from 'defu'

const inlineConfig = {
  "nuxt": {
    "buildId": "b2460149-e0dd-4a9c-b651-138bdc133e96"
  }
}

// Vite - webpack is handled directly in #app/config
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    updateAppConfig(newModule.default)
  })
}

import cfg0 from "/Users/icon/ico/uhtairdrop/app.config.ts"

export default /*@__PURE__*/ defuFn(cfg0, inlineConfig)
