import { Icon, SourceLinkButton } from '@/components/common'
import { media } from '@/const'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'

export default function Home() {
  return (
    <>
      <Head>
        <title>WebGLスクール課題提出用ページ</title>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <Wrapper>
        <Inner>
          <Title> WebGLスクール課題提出用ページ</Title>
          <List>
            <NavItem href='/report1'>&gt; REPORT 1</NavItem>
          </List>
          <ButtonArea>
            <SourceLinkButton
              href={
                'https://github.com/matsurai25/webgl-school-2024/'
              }
              target={'_blank'}
              rel='noopener noreferrer'
            >
              <Icon src={'/icon-github.svg'} />
              GitHub
            </SourceLinkButton>
          </ButtonArea>
        </Inner>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  padding: 10rem 0;

  ${media.mobile} {
    padding: 4rem 0;
  }
`
const Inner = styled.div`
  width: 100rem;
  margin: 0 auto;

  ${media.mobile} {
    width: 34.3rem;
  }
`

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 4rem;

  ${media.mobile} {
    font-size: 1.6rem;
  }
`

const List = styled.ul`
  display: grid;
`

const NavItem = styled(Link)`
  font-size: 2.4rem;
  background-color: #f0f0f0;
  padding: 1rem 2rem;
  text-decoration: none;
  color: #000;

  &:hover {
    background-color: #000;
    color: #fff;
  }

  ${media.mobile} {
    font-size: 1.6rem;
  }
`

const ButtonArea = styled.div`
  margin-top: 4rem;
  display: flex;
  justify-content: flex-start;
`
