import { Box, Grid } from "@chakra-ui/react"
import { Chakra } from "../Chakra"
import { Layout } from "../components/Layout"
import Form from "../components/Form"

interface IndexProps {
  cookies?: string
}

const IndexPage = ({ cookies }: IndexProps) => (
  <Chakra cookies={cookies}>
    <Layout title="URL Transport">
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
         <Form/>
        </Grid>
      </Box>
    </Layout>
  </Chakra>
)

export default IndexPage
export { getServerSideProps } from "../Chakra"
