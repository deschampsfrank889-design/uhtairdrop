
import { updateAppConfig } from '#app/config'
import { defuFn } from 'defu'

const inlineConfig = {
  "nuxt": {
    "buildId": "af9e5d52-4c39-4952-9904-4111d4318b57"
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
