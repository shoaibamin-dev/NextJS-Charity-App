import { useEffect, useState } from 'react';
import Head from 'next/head';
import { subscribe } from "react-contextual";
import { useRouter } from 'next/router';
import * as api from '@/_shared/libs/api';

import {
  Document,
  Button,
  Box,
  Layouts,
  Form
} from '@/_shared/ui';

/**
 * Responsible for displaying the form to reset password.
 */
const AdpComplete = (props) => {

  return (
    <>
      <Document.Header title="ADP Connection Success" />
      <Layouts.ActionBox>
        <Box paper={true} title={'Connection Success'} footer={[
          <Button type="link" href="/" fullWidth={true} inverted theme="secondary">Cancel</Button>,
          <Button onClick={() => window.location.href = '/'} type="button" fullWidth={true}>Continue</Button>
        ]}>
          <p>ADP signup was successfull. Please check your email to verify your account for GVNGorg.</p>
        </Box>
      </Layouts.ActionBox>
    </>
  )
}

export default subscribe()(AdpComplete);
