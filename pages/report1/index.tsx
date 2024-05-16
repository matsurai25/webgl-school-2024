import { media } from '@/const'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { css, styled } from 'styled-components'
import { ThreeApp } from '@/components/report1/ThreeApp'
import {
  Icon,
  LinkArea,
  LinkButton,
  SourceLinkButton
} from '@/components/common'

export default function Page() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (wrapper === null) {
      return
    }
    const app = new ThreeApp(wrapper)
    app.render()
    ;(window as any).app = app
    return () => {
      wrapper.removeChild(app.renderer.domElement)
    }
  }, [])

  return (
    <Wrapper ref={wrapperRef}>
      <LinkArea>
        <LinkButton href={'/'}>
          <Icon src={'/icon-back.svg'} />
          BACK
        </LinkButton>
        <SourceLinkButton
          href={
            'https://github.com/matsurai25/webgl-school-2024/blob/main/components/report1/ThreeApp.ts'
          }
          target={'_blank'}
          rel='noopener noreferrer'
        >
          <Icon src={'/icon-github.svg'} />
          GitHub
        </SourceLinkButton>
      </LinkArea>
      <Img src={'/report1.svg'} />
      <Overlay />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100svh;
  background-color: #efefef;

  canvas {
    &.intersecting {
      cursor: pointer;
    }
  }
`

const Img = styled.img`
  position: fixed;
  bottom: 4rem;
  right: 4rem;
  width: 80rem;

  ${media.mobile} {
    bottom: 0.8rem;
    right: 0.8rem;
    width: 32rem;
  }
`

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: fixed;
  z-index: 10;
  // 上から下に向かってグラデーションをかける
  background-image: linear-gradient(
    to bottom,
    rgb(239, 239, 239, 0.8),
    rgb(239, 239, 239, 0) 50%
  );
`
