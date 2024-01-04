import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH, FaBell, FaQuestion } from 'react-icons/fa';
import { useSession, useSettings, useResize } from '@/_shared/hooks';
import Image from 'next/image'

import {
  Document,
  Button,
  Paper,
  Form,
  Box,
  Section,
  Grid,
  PageHeader,
  Card,
  Modal,
  List,
  Layouts,
  Tooltip,
  Dropdown,
  Label,
  Charts,
  Table,
  Stat,
  ContentBox,
  Title,
  DashboardCharts,
  CampaignList,
  DashboardModals,
  CampaignCard
} from '@/_shared/ui';

import  {Container, Row, Col} from 'reactstrap';

import FundRaiser from '@/_shared/ui/fundraisers';

const Home = (props) => {

  const [ modalOpen, setModalOpen ]   = useState(false);
  const { session, sessionLoading }   = useSession(props, { require: true });
  const { settings, settingsLoading } = useSettings(props, 'dashboard');
  const [ campaignCreateModalOpen, setCampaignCreateModalOpen ] = useState(false);

  const header = (
    <Document.Header title="Dashboard" />
  );

  if (sessionLoading || !sessionLoading && !session || settingsLoading) {
    return header
  }

  return (
    <>
      {header}
      <Layouts.Dashboard className={campaignCreateModalOpen && "bg-white" || ""}>
        <Section style={ {backgroundColor: '#f6f6f6'}}>

        <div
                style={{
                    height: "133px"
                              
                }}
                className={styles.imageParent}>
                <Image objectFit="cover" src={'/assets/images/home-header.png'} height="133px" width="1356px"/>
                 </div>
                <span className={styles.HomeHeader}>
                        SHARE THE LOVE
                        </span>


                        {
            props.session.data.selected_account_role === 1 && (
              <Row className="my-4" style={{ alignItems: 'stretch' }}>
                
                <Col sm={12} md={7} lg={7}>
                  
                  <h4 className={styles.GivintAtGlanceHeading}>Your Giving at A Glance</h4>

                  <Row className="p-3">

                  <Col className="my-2" md="6" lg="6" sm="12">
                  <Box hoverable={true} paper={true} theme={`white`} styles={{}}>
                    <Stat title="Balance" value={`$${props.session.data.account ? props.session.data.account.totalBalance.toFixed(2) : 0.00}`} />
                  </Box>
                  </Col>

                  <Col className="my-2" md="6" lg="6" sm="12">
                  <Box  hoverable={true} paper={true} theme={`white`}>
                    <Stat title="My Contributions" subtitle="(This Year)" value={`$${props.session.data.account ? props.session.data.account.year.contributionsTotal.toFixed(2) : 0.00}`} />
                  </Box>
                  </Col>

                  <Col className="my-2" md="6" lg="6" sm="12">
                  <Box hoverable={true} paper={true} theme={`white`}>
                    <Stat title="Crowdfunding Raised" subtitle="(This Year)" value={`$${props.session.data.account ? props.session.data.account.year.donationTotal.toFixed(2) : 0.00}`} />
                  </Box>
                  </Col>

                  <Col  className="my-2" md="6" lg="6" sm="12">
 
                  <Box hoverable={true} paper={true} theme={`white`}>
                    <Stat title="My Donations" subtitle="(This Year)" value={`$${props.session.data.account ? props.session.data.account.year.grantsTotal.toFixed(2) : 0.00}`} />
                  </Box>
                  </Col>
                  
                  </Row>

                </Col>
            
                <Col className="m-auto" sm={12} md={5} lg={5} >
                  
                  <Row  className="p-2 py-4 m-auto" style={{backgroundImage:"url(/assets/images/home/crowdfunding.jpg)", backgroundSize:"contain"}}>
                     
                      <Col className="m-auto" lg="5" md="5" sm="12">
                      <h3 className="c-white">Create a Crowdfunding Campaign!</h3>
                      </Col>
                      <Col lg="7" md="7" sm="12">
                      <p style={{color:'white'}}>We’ve made it so easy to help support the causes you care about. Just click the button to get started. Learn more <a style={{ color: 'white', fontWeight: 'bold' }} href="https://support.gvng.org/hc/en-us/sections/360011499651-CROWDFUNDING" target="_blank">here</a>.</p>
                      <Button onClick={() => setCampaignCreateModalOpen(true)} maxContent={true} type="button" className="w-100 text-align-center" theme={`primary`}>Let's Get Started</Button>
                  
                      </Col>
                   
                  </Row>
                   
                </Col>
            
              </Row>
            )
          }

          
          <div style={{ clear: 'both', height: 1, width: '100%' }} />
          <Grid.Row>
            <Grid.Col m={12} t={12} d={12}>
              <Title theme="light" size="3">Your Crowdfunding Campaigns</Title>
              <Row>

<Col className="mb-2" md="6" lg="6" sm="12">
<Box paper={true} theme={`white`} styles={{}}>
  <CampaignCard title="The United Way" subtitle="Raised" value="$2,000"/>
</Box>
</Col>
<Col className="mb-2" md="6" lg="6" sm="12">
<Box paper={true} theme={`white`} styles={{}}>
  <CampaignCard title="Boy’s Club of Dallas" subtitle="Raised" value="$1,500"/>
</Box>
</Col>
</Row>
              {/* <CampaignList /> */}
            </Grid.Col>
          </Grid.Row>
       

       <div style={{ clear: 'both', height: 1, width: '100%' }}/>


       <Grid.Row>
            <Grid.Col m={12} t={12} d={12}>
              <Title theme="light" size="3">Top GVNG Fundraisers</Title>
              <FundRaiser/>
            </Grid.Col>
          </Grid.Row>
       
        </Section>

       

        <DashboardModals.Campaign className="bg-white" action={`create`} openSnackbar={props.openSnackbar} open={campaignCreateModalOpen} onClose={() => setCampaignCreateModalOpen(false)} />
      </Layouts.Dashboard>
    </>
  )
}

export default subscribe()(Home);
