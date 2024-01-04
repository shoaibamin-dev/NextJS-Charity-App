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
const AdpSignup = (props) => {

  const router = useRouter();

  const [ email, setEmail ] = useState('A.Albright@gmail.com');
  const [ password, setPassword ] = useState('ff209f3ffsg');
  const [ loading, setLoading ] = useState(true);
  const [ registering, setRegistering ] = useState(false);

  useEffect(() => {
    if (router.query.code || router.query.scope || router.query.consent) {
      const { code, scope, consent, id } = router.query;

      if (code) {
        window.location.href = 'https://adpapps.adp.com/consent-manager/pending/direct?consumerApplicationID=926dcc0e-5461-437b-a182-ac21f5de2391&successUri=https://app.gvng-staging.org/signup/adp?consent=1';
      } else if (consent === "1") {
        router.push('/signup/adp/complete')
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [ router.query ]);

  const submit = async () => {
    setRegistering(true);

    if (!email) {
      props.openSnackbar('Please provide an email.', 'error');
      return false;
    }

    if (!password) {
      props.openSnackbar('Please provide a password', 'error');
      return false;
    }

    try {

      const res = await api.post('/v1/adp/signup', {
        email: email,
        password: password
      });

      if (!res) {
        props.openSnackbar('Unable to process', 'error');
        setRegistering(false);
        return false;
      }

      if (!res.success) {
        props.openSnackbar(res.message, 'error');
        setRegistering(false);
        return false;
      }

      if (!res.uuid) {
        props.openSnackbar('Unable to process', 'error');
        setRegistering(false);
        return false;
      }

      window.location.href = 'https://accounts.adp.com/auth/oauth/v2/authorize?client_id=d0eb34cf-bcaf-4f4c-8c06-37664e32501c&response_type=code&scope=openid&redirect_uri=https://app.gvng-staging.org/signup/adp';
    } catch (error) {
      props.openSnackbar('Unable to process', 'error');
      setRegistering(false);
      return false;
    }
  }

  if (loading || router.query.code || router.query.consent || !router.query) return (<div />);

  return (
    <>
      <Document.Header title="Sign up with ADP" />
      <Layouts.ActionBox>
        <Box paper={true} title={'Sign up with ADP'} loading={loading} footer={[
          <Button type="link" href="/" fullWidth={true} inverted theme="secondary">Cancel</Button>,
          <Button onLoading={registering} onClick={submit} type="button" fullWidth={true}>Continue</Button>
        ]}>
          <Form.Input value={email} onChange={val => setEmail(val)} type="email" label="ADP Email" fullWidth={true} />
          <hr />
          <Form.Input value={password} onChange={val => setPassword(val)} type="password" label="Password" fullWidth={true} />
          <p style={{fontSize: 14}}>This password will be used to access your GVNGorg account.</p>
        </Box>
      </Layouts.ActionBox>
    </>
  )
}

export default subscribe()(AdpSignup);
