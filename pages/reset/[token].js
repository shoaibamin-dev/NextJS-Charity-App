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
  Layouts,
  Form
} from '@/_shared/ui';

/**
 * Responsible for resetting a password
 */
const Reset = (props) => {

  const router = useRouter();

  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');

  if (!props.data) {
    return (
      <ErrorPage statusCode={404} />
    )
  }

  if (props.data.status === false) {
    return (
      <ErrorPage statusCode={404} />
    )
  }

  const submit = async () => {
    if (password !== confirmPassword) {
      props.openSnackbar('Passwords do not match.', 'error');
      return false;
    }

    const res = await api.post('/v1/user/update-password', {
      token: props.token,
      password
    });

    if (!res) {
      props.openSnackbar('There was an issue with updating your password. Please try again.', 'error');
      return false;
    }

    props.openSnackbar('You may now login');
    router.push('/');
  }

  return (
    <>
      <Document.Header title="Reset Password" />
      <Layouts.ActionBox>
        <Box paper={true} title={'Reset Password'} footer={[
          <Button onClick={submit} type="button" fullWidth={true}>Submit</Button>
        ]}>
          <p>Please set a new password for your account. After you've updated your password, you will be able to login to your account.</p>
          <Form.Input value={password} onChange={val => setPassword(val)} type="password" label="Password" fullWidth={true} />
          <Form.Input value={confirmPassword} onChange={val => setConfirmPassword(val)} type="password" label="confirm Password" fullWidth={true} />
        </Box>
      </Layouts.ActionBox>
    </>
  )
}

/**
 * Attempt to access the invitation
 */
export async function getServerSideProps({ query }) {
  const data = await api.post('/v1/user/reset', { token: query.token });
  return { props: { data, token: query.token } };
}

export default subscribe()(Reset);
