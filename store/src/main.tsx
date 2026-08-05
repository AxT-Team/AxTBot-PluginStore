import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { siteConfig } from './lib/siteConfig'

// 默认 favicon：蓝色圆角方块 + 白色机器人图标（与 Header 默认图标一致）
const DEFAULT_FAVICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0080ff"/><path d="M16 5c-3 0-5 2-5 5v1H8.5C7.1 11 6 12.1 6 13.5v4C6 18.9 7.1 20 8.5 20H11v1c0 3 2 5 5 5s5-2 5-5v-1h2.5c1.4 0 2.5-1.1 2.5-2.5v-4c0-1.4-1.1-2.5-2.5-2.5H21v-1c0-3-2-5-5-5zm-4 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm8 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="#fff"/></svg>`,
  )

function setFavicon(url: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = url
}

setFavicon(siteConfig.logo || DEFAULT_FAVICON)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
