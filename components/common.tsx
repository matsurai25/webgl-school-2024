import { media } from '@/const'
import Link from 'next/link'
import { css, styled } from 'styled-components'

export const LinkArea = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  gap: 1.6rem;

  ${media.mobile} {
    top: 1.6rem;
    left: 1.6rem;
  }
`

export const linkStyle = css`
  color: #fff;
  text-decoration: none;
  font-size: 1.6rem;
  background-color: #000000;
  padding: 1rem 2.4rem;
  border-radius: 4rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &:hover {
    opacity: 0.8;
  }

  ${media.mobile} {
    font-size: 1.2rem;
    padding: 0.8rem 2rem;
  }
`

export const LinkButton = styled(Link)`
  ${linkStyle}
`

export const SourceLinkButton = styled.a`
  ${linkStyle}
`

export const Icon = styled.img`
  width: 2.4rem;
  height: 2.4rem;
  display: inline-block;
`
