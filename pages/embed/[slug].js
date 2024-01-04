import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH, FaBell, FaQuestion } from 'react-icons/fa';
import { useSnackbar } from '@/_shared/hooks';
import donors from '@/_shared/data/donor-list.json';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error'
import * as api from '@/_shared/libs/api';

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
  ContentBox,
  Title,
  CampaignCard,
  CampaignImage,
  CampaignProgress,
  CampaignDonorList,
  CampaignInformationBlocks
} from '@/_shared/ui';

const Campaign = (props) => {

  const { snackbar, openSnackbar }  = useSnackbar(2);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const router = useRouter()
  const { cid, size } = router.query;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof document !== 'undefined') {
        document.body.setAttribute('style', 'background-color: transparent !important')
      }
    }
  }, []);

  const openWindow = () => {

    // Make sure this is not SSR, window does not exist there.
    if (typeof window !== 'undefined') {
      window.open(`${process.env.NEXT_PUBLIC_PLATFORM_URL}/donate/${props.campaign.slug}`, '_blank');
    }
  }

  return (
    <>
      <Document.Header title="Campaign" />
      <Layouts.EmbedCampaign>
        <Box paper={true}>
          {
            size !== 'medium' && size !== 'small' && (
              <CampaignImage campaign={props.campaign} />
            )
          }
          {
            size !== 'small' && (
              <>
                <Title size={3}>{props.campaign.name}</Title>
                <CampaignProgress
                  flipped={true}
                  raised={props.campaign ? props.campaign.total_raised : 0.00}
                  goal={props.campaign ? props.campaign.goal : 0.00}
                /><br />
              </>
            )
          }
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button onClick={openWindow} type="button" theme={`primary`} fullWidth={true}>Donate Now</Button>
            <div style={{ marginLeft: '25px' }}>
              <img src="/gvngorg-logo.svg" style={{ width: 'auto', height: '25px'}} />
            </div>
          </div>
        </Box>
        <Snackbar {...snackbar} />
      </Layouts.EmbedCampaign>
      <script src="/assets/iframeResizer.contentWindow.js"></script>
    </>
  )
}

/**
 * Retrieve the campaign data on the server first.
 */
export async function getServerSideProps({ query }) {
  const campaign = await api.post('/v1/campaign/slug', { slug: query.slug });
  return { props: { campaign } };
}

export default subscribe()(Campaign);
