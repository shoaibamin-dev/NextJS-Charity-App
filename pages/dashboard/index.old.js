import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH, FaBell, FaQuestion } from 'react-icons/fa';
import { useSnackbar } from '@/_shared/hooks';

import {
  Button,
  Paper,
  Form,
  Box,
  Section,
  Grid,
  PageHeader,
  Card,
  Snackbar,
  Modal,
  List,
  Layouts,
  Tooltip,
  Dropdown,
  Label,
  Charts,
  Table,
  Stat,
  ContentBox
} from '@/_shared/ui';

/**
 * @deprecated
 *
 * Keeping this for reference on some of the UI component
 * library that I built.
 */
const Home = (props) => {

  const { snackbar, openSnackbar }  = useSnackbar(2);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    console.log(process.env.NEXT_PUBLIC_API_URL);
  }, []);

  return (
    <>
      <Head>
        <title>GVNG - Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
      </Head>
      <Layouts.Dashboard>
        <Section>
          <Grid.Row>
            <Grid.Col m={12} t={12} d={12}>
              <Box paper={true} theme={`purple`} graphic={`gvng`}>
                <ContentBox width={`60%`} maxWidth={`60%`} padding={`15px`}>
                  <h3 style={{marginTop: 0, marginBottom: 5}}>Create a Crowdfunding Campaign!</h3>
                  <p>We’ve made it so easy!  Find out what you need to know about creating and promoting an event or crowdfunding campaign in our FAQs.</p>
                  <Button maxContent={true} type="button" theme={`primary`}>Create a Campaign</Button>
                </ContentBox>
              </Box>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col m={12} t={8} d={8}>
              <Box loading={loading} paper={true}>
                <Charts.Line
                  labels={[ 'February', 'March', 'April', 'May', 'June', 'July' ]}
                  data={[
                    {
                      label: 'Money Raised',
                      data: [ 59, 80, 81, 72, 99, 83 ]
                    }
                  ]}
                />
              </Box>
            </Grid.Col>
            <Grid.Col m={12} t={4} d={4}>
              <Box paper={true} theme={`purple`}>
                <Stat title="Balance" value="$12.00" />
              </Box>

              <Box paper={true} theme={`dark-purple`}>
                <Stat title="My Contributions" value="$12.00" />
              </Box>

              <Box paper={true} theme={`red`}>
                <Stat title="Granted" value="$12.00" />
              </Box>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col m={12} t={6} d={8}>
              <Box loading={loading} paper={true} title="Arnold Movies">
                <Table />
              </Box>
              <Box loading={loading} paper={true} title="Example Graph">
                <Charts.Bar
                  labels={[ 'February', 'March', 'April', 'May', 'June', 'July' ]}
                  data={[
                    {
                      label: 'Money Raised',
                      data: [
                        {
                          value: 65,
                          background: 'rgba(255, 99, 132, 0.2)',
                          border: 'rgba(255, 99, 132, 1)'
                        },
                        {
                          value: 67,
                          background: 'rgba(54, 162, 235, 0.2)',
                          border: 'rgba(54, 162, 235, 1)'
                        },
                        {
                          value: 72,
                          background: 'rgba(255, 206, 86, 0.2)',
                          border: 'rgba(255, 206, 86, 1)'
                        },
                        {
                          value: 59,
                          background: 'rgba(75, 192, 192, 0.2)',
                          border: 'rgba(75, 192, 192, 1)'
                        },
                        {
                          value: 85,
                          background: 'rgba(153, 102, 255, 0.2)',
                          border: 'rgba(153, 102, 255, 1)'
                        },
                        {
                          value: 92,
                          background: 'rgba(255, 159, 64, 0.2)',
                          border: 'rgba(255, 159, 64, 1)'
                        },
                      ]
                    }
                  ]}
                />
              </Box>
              <Box
                paper={true}
                title="Information"
                extra={(
                  <Dropdown
                    trigger={{
                      type: 'button',
                      label: <FaQuestion />
                    }}
                    items={[
                    { label: 'Test 1', onClick: () => console.log('test') },
                    { label: 'Test 2', onClick: () => console.log('test') },
                    { label: 'Test 3', onClick: () => console.log('test') },
                  ]} />
                )}
                footer={[<Button key={0} fullWidth={true}>Test</Button>]}
              >
                <Form.Input fullWidth={true} type="text" />
              </Box>

              <Form.Wrapper box={{
                paper: true,
                title: "Information",
                loading: loading
              }}>
                <Form.Input name="name" label={<>Full Name <Label>Required</Label></>} fullWidth={true} type="text" />
                <Form.Input name="email" label="Email" fullWidth={true} type="email" />
                <Form.Input name="password" label="Password" fullWidth={true} type="password" />
                <Form.Select name="state" label="State" options={[
                  {
                    label: 'Kentucky',
                    value: 'Kentucky'
                  },
                  {
                    label: 'Test',
                    value: 'Test'
                  }
                ]} />
                <Button type="submit" key={0} theme={`secondary`} inverted={true} fullWidth={true}>Test</Button>
              </Form.Wrapper>
            </Grid.Col>
            <Grid.Col m={12} t={6} d={4}>


              <Card
                extra={(
                  <Dropdown
                    trigger={{
                      type: 'button',
                      label: <FaEllipsisH />
                    }}
                    items={[
                    { label: 'Test 1', onClick: () => console.log('test') },
                    { label: 'Test 2', onClick: () => console.log('test') },
                    { label: 'Test 3', onClick: () => console.log('test') },
                  ]} />
                )}
                image={`http://account.ravn.gvng/files/14ad5590-775f-4707-bff0-3fbffb129d37/8dea20e4-18d8-4b18-ba72-129be52126e9.jpeg`}
                title="This is a test"
                footer={[
                  <Button key={0} onClick={() => { openSnackbar('This feature is currently undergoing maintenance', 'error') }} fullWidth={true} inverted={true}>Action Here</Button>
                ]}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </Card>

              <Box paper={true} theme={`purple`}>
                <Stat title="Testing" value="$12.00" />
              </Box>

              <Box paper={true} theme={`dark-purple`}>
                <Stat title="Testing" value="$12.00" />
              </Box>

              <Box paper={true} theme={`red`}>
                <Stat title="Testing" value="$12.00" />
              </Box>

              <Box
                paper={true}
                title="Example Navigation"
                padding={0}
              >
                <List items={[
                  { label: 'Help & FAQs', href: 'https://support.gvng.org' },
                  { label: 'Signup Example' },
                  { label: 'Settings' },
                ]} />
              </Box>

              <Box
                paper={true}
                title="Test Stats"
                padding={0}
              >
                <Stat spaced={true} title="Deposits" value="$12.00" />
                <Stat spaced={true} title="Deposits" value="$12.00" />
                <Stat spaced={true} title="Deposits" value="$12.00" />
              </Box>
            </Grid.Col>
          </Grid.Row>
        </Section>
        <Snackbar {...snackbar} />
        <Modal
          open={modalOpen}
          title={"Testing"}
          onClose={() => setModalOpen(false)}
          footer={[
            <Button key={0} theme={`secondary`} inverted={true} fullWidth={true} onClick={() => setModalOpen(false)}>
              Cancel
            </Button>,
            <Button key={1} theme={`primary`} fullWidth={true} onClick={() => setModalOpen(false)}>
              Test
            </Button>
          ]}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Modal>
      </Layouts.Dashboard>
    </>
  )
}

export default subscribe()(Home);
