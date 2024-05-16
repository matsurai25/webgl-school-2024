import { media } from '@/const'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import { ThreeApp } from '@/components/report1/ThreeApp'

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
      <BackLink href={'/'}>BACK</BackLink>
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

const BackLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1;
  font-size: 1.6rem;
  background-color: #000000;
  z-index: 100;
  padding: 1.2rem 4rem;
  border-radius: 4rem;

  ${media.mobile} {
    top: 1.6rem;
    left: 1.6rem;
    font-size: 1.2rem;
    padding: 0.8rem 2rem;
    border-radius: 4rem;
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
