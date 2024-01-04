import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH, FaBell, FaQuestion } from 'react-icons/fa';
import { useSession, useSettings } from '@/_shared/hooks';
import topCharities from '@/_shared/data/top-charities.json';
import { favoriteCharities, listCharities } from '@/_shared/libs/api';

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
  Charities as Charity,
  DashboardTables,
  Pages
} from '@/_shared/ui';

/**
 * Responsible for displaying grant data, charity data,
 * and previous grants from a specific account.
 */
const Charities = (props) => {

  // Several states to keep track of.
  const [ modalOpen, setModalOpen ] = useState(false);
  const { session, sessionLoading } = useSession(props, { require: true });
  const { settings, settingsLoading } = useSettings(props, 'dashboard');
  const [ favorites, setFavorites ] = useState(false);
  const [ favoritesLoading, setFavoritesLoading ] = useState(false);
  const [ favoritesString, setFavoritesString ] = useState('');
  const [ searchCharityList, setSearchCharityList ] = useState(props.charities);
  const [ searchCharitySelected, setSearchCharitySelected ] = useState(undefined);

  const retrieveFavorites = async () => {
    setFavoritesLoading(true);
    const res = await favoriteCharities();

    if (res !== false) {
      setFavoritesString(res);
      setFavorites(await listCharities(res));
    }

    setFavoritesLoading(false);
  }

  useEffect(() => {
    if (!favorites) {
      retrieveFavorites();
    }
  }, []);

  // Set the header of the page
  const header = (
    <Document.Header title="Charities" />
  );

  // If the session is loading, only render the head
  if (sessionLoading || !sessionLoading && !session || settingsLoading) {
    return header
  }

  if (props.settings.data.grants_enabled === false) {
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
                title="Grant Summary"
                padding={0}
              >
                <Stat spaced={true} title="Current Balance" value={`$${props.session.data.account ? props.session.data.account.totalBalance.toFixed(2) : 0.00}`} />
                <Stat spaced={true} title="Amount Granted This Year" value={`$${props.session.data.account ? props.session.data.account.year.grantsTotal.toFixed(2) : 0.00}`} />
              </Box>

              <Box
                paper={true}
                title="What can I do now?"
                padding={0}
              >
                <List items={[
                  { label: 'Request a Grant', onClick: () => setModalOpen.bind(this, true) },
                  { label: 'Search for a Cause', onClick: () => setModalOpen.bind(this, true) },
                ]} />
              </Box>
            </Grid.Col>

            <Grid.Col m={12} t={4} d={4}>
              <Box
                paper={true}
                title="Favorite Charities"
                padding={0}
                contentHeight={455}
                loading={favoritesLoading}
                extra={(
                  <Button onClick={() => setModalOpen(true)} type="button" key={0} theme={`primary`} size="small">Search</Button>
                )}
              >
                <Charity.List charities={favorites} onClick={charity => {
                  setSearchCharityList(favorites);
                  setSearchCharitySelected(charity);
                  setModalOpen(true);
                }} />
              </Box>
            </Grid.Col>

            <Grid.Col m={12} t={4} d={4}>
              <Box
                paper={true}
                title="Top Charities"
                padding={0}
                contentHeight={455}
              >
                <Charity.List charities={props.charities} onClick={charity => {
                  setSearchCharityList(props.charities);
                  setSearchCharitySelected(charity);
                  setModalOpen(true);
                }} />
              </Box>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col m={12} t={12} d={12}>
              <DashboardTables.RecentGrants />
            </Grid.Col>
          </Grid.Row>
        </Section>
        <Modal
          open={modalOpen}
          title={"Charity Search"}
          onClose={() => setModalOpen(false)}
          fullScreen={true}
          noPadding={true}
        >
          <Charity.Search
            status={modalOpen ? 'open' : 'closed'}
            onGranted={() => setModalOpen(false)}
            openSnackbar={props.openSnackbar}
            onFavoritesChange={retrieveFavorites}
            favorites={favoritesString}
            charities={searchCharityList}
            selected={searchCharitySelected}
            defaultCharities={props.charities}
          />
        </Modal>
      </Layouts.Dashboard>
    </>
  )
}

export async function getStaticProps() {

  return {
    props: {
      charities: topCharities.data,
    },
  }
}

export default subscribe()(Charities);
