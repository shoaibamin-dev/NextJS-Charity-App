import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH, FaBell, FaQuestion } from 'react-icons/fa';
import { useSession, useSettings } from '@/_shared/hooks';

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
  Title,
  CampaignCard,
  DashboardTables,
  CampaignList,
  DashboardModals
} from '@/_shared/ui';

/**
 * Responsible for displaying all things that are
 * crowdfunding campaign related.
 */
const Crowdfunding = (props) => {

  // Several states to keep track of
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ campaignCreateModalOpen, setCampaignCreateModalOpen ] = useState(false);
  const { session, sessionLoading } = useSession(props, { require: true });
  const { settings, settingsLoading } = useSettings(props, 'dashboard');

  // Set the header of the page
  const header = (
    <Document.Header title="Crowdfunding" />
  );

  // If the session is loading, only render the head
  if (sessionLoading || !sessionLoading && !session || settingsLoading) {
    return header
  }

  if (props.settings.data.donations_enabled === false) {
    return (
      <>
        {header}
        <Layouts.Dashboard>
          <Pages.Disabled />
        </Layouts.Dashboard>
      </>
    )
  }

  return (
    <>
      {header}
      <Layouts.Dashboard>
        <Section>
          <Grid.Row>
            <Grid.Col m={12} t={4} d={4}>
              <Box
                paper={true}
                title="Crowdfunding Summary"
                padding={0}
              >
                <Stat spaced={true} title="Total Raised" value={`$${props.session.data.account ? props.session.data.account.donationTotal.toFixed(2) : 0.00}`} />
                <Stat spaced={true} title="Raised this Month" value={`$${props.session.data.account ? props.session.data.account.month.donationTotal.toFixed(2) : 0.00}`} />
                <Stat spaced={true} title="" value={(
                  <Button onClick={() => setCampaignCreateModalOpen(true)} type="button" key={0} theme={`primary`} size="medium">Launch a Campaign</Button>
                )} />
              </Box>
            </Grid.Col>

            <Grid.Col m={12} t={8} d={8}>
              <DashboardTables.RecentDonations type={`account`} id={props.session.data.selected_account} />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col m={12} t={12} d={12}>
              <Title theme="secondary" size="3">Active Campaigns</Title>
              <CampaignList type={`active`} />
            </Grid.Col>
          </Grid.Row>
        </Section>
        <DashboardModals.Campaign action={`create`} openSnackbar={props.openSnackbar} open={campaignCreateModalOpen} onClose={() => setCampaignCreateModalOpen(false)} />
      </Layouts.Dashboard>
    </>
  )
}

export default subscribe()(Crowdfunding);
