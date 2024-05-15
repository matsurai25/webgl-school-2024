import 'reset-css'
import type { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'
import { media } from '@/const'

export default function App({
  Component,
  pageProps
}: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}

const GlobalStyles = createGlobalStyle`
  html,
  body {
    font-size: max(min(calc(100vw / 1440 * 10), 10px), calc(100vw / 1920 * 10));
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 400;
    letter-spacing: 0.05em;

    ${media.mobile} {
      font-size: calc(100vw / 375 * 10);
    }
  }
`
