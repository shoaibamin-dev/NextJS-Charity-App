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
  DashboardCharts,
  DashboardTables,
  DashboardModals
} from '@/_shared/ui';

const Contributions = (props) => {

  // Several states to keep track of
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ contributeModalOpen, setContributeModalOpen ] = useState(false);
  const { session, sessionLoading } = useSession(props, { require: true });
  const { settings, settingsLoading } = useSettings(props, 'dashboard');

  // Set the header of the page
  const header = (
    <Head>
      <title>GVNGorg - My Contributions</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );

  // If the session is loading, only render the head
  if (sessionLoading || !sessionLoading && !session || settingsLoading) {
    return header
  }

  if (props.settings.data.contributions_enabled === false) {
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
                title="Contribution Summary"
                padding={0}
              >
                <Stat spaced={true} title="Current Balance" value={`$${props.session.data.account ? props.session.data.account.totalBalance.toFixed(2) : 0.00}`} />
                <Stat spaced={true} title="Amount Contributed This Year" value={`$${props.session.data.account ? props.session.data.account.year.contributionsTotal.toFixed(2) : 0.00}`} />
              </Box>

              <Box
                paper={true}
                title="What can I do now?"
                padding={0}
              >
                <List items={[
                  { label: 'Contribute to your account', onClick: () => setContributeModalOpen.bind(this, true) },
                  { label: 'Recurring contributions', onClick: () => setContributeModalOpen.bind(this, true) },
                ]} />
              </Box>
            </Grid.Col>

            <Grid.Col m={12} t={8} d={8}>
              <DashboardCharts.ContributionActivity />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col m={12} t={12} d={12}>
              <DashboardTables.RecentContributions />
            </Grid.Col>
          </Grid.Row>
        </Section>
        <DashboardModals.Contribute openSnackbar={props.openSnackbar} open={contributeModalOpen} onClose={() => setContributeModalOpen(false)} />
      </Layouts.Dashboard>
    </>
  )
}

export default subscribe()(Contributions);
