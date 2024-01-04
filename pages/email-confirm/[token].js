import { useEffect, useState } from 'react';
import Head from 'next/head';
import { subscribe } from "react-contextual";
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import * as api from '@/_shared/libs/api';

import {
  Document,
  Button,
  Box,
  Layouts
} from '@/_shared/ui';

/**
 * Responsible for confirming email
 */
const EmailConfirm = (props) => {

  if (!props.data) {
    return (
      <ErrorPage statusCode={404} />
    )
  }

  return (
    <>
      <Document.Header title="Confirm Email" />
      <Layouts.ActionBox>
        <Box paper={true} title={'Email Address Confirmed!'} footer={[
          <Button type="link" href="/dashboard" fullWidth={true}>Continue to Dashboard</Button>
        ]}>
          Thank you for confirming your email address, you may now continue to use GVNGorg's platform as usual.
        </Box>
      </Layouts.ActionBox>
    </>
  )
}

/**
 * Retrieve the campaign data on the server first.
 */
export async function getServerSideProps({ query }) {
  const data = await api.post('/v1/user/email-confirm', { token: query.token });
  return { props: { data } };
}

export default subscribe()(EmailConfirm);
