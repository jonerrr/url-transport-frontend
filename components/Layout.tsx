import { ReactNode } from "react"
import Head from "next/head"
import { Container, Flex, Heading, HStack } from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { NextChakraLink } from "./NextChakraLink"

type Props = {
  children?: ReactNode
  title?: string
}

export const Layout = ({
  children,
  title,
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Container maxWidth="1200px">
      {children}
    </Container>
  </div>
)
