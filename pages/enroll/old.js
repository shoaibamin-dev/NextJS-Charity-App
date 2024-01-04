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
const Enroll = (props) => {

  const router = useRouter();

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ enrolled, setEnrolled ] = useState(false);

  if (!props.data) {
    return (
      <ErrorPage statusCode={404} />
    )
  }

  const submit = async () => {
    if (password !== confirmPassword) {
      props.openSnackbar('Passwords do not match.', 'error');
      return false;
    }

    const res = await api.post('/v1/company/enroll', {
      id: props.id,
      name,
      email,
      password
    }, true);

    if (!res) {
      props.openSnackbar('There was an issue with your enrollment. Please try again', 'error');
      return false;
    }

    if (!res.success) {
      props.openSnackbar(res.message, 'error');
      return false;
    }

    setEnrolled(true);
  }

  if (enrolled === true) {
    return (
      <>
        <Document.Header title="Enrollment" />
        <Layouts.ActionBox>
          <Box paper={true} title={`Enrolled!`}>
            <p style={{ textAlign: 'center' }}>
              You are now enrolled in {props.data.name}'s employee charitable donations program.
            </p>
          </Box>
        </Layouts.ActionBox>
      </>
    )
  }

  return (
    <>
      <Document.Header title="Enrollment" />
      <Layouts.ActionBox>
        <Box paper={true} title={`Enrollment for ${props.data.name}`} footer={[
          <Button onClick={submit} type="button" fullWidth={true}>Enroll</Button>
        ]}>
          <p>Please complete the form below to complete your enrollment for {props.data.name}</p>
          <Form.Input value={name} onChange={val => setName(val)} type="text" label="Full name" fullWidth={true} />
          <Form.Input value={email} onChange={val => setEmail(val)} type="email" label="Email address" fullWidth={true} />
          <Form.Input value={password} onChange={val => setPassword(val)} type="password" label="Password" fullWidth={true} />
          <Form.Input value={confirmPassword} onChange={val => setConfirmPassword(val)} type="password" label="Confirm Password" fullWidth={true} />
        </Box>
      </Layouts.ActionBox>
    </>
  )
}

/**
 * Attempt to access the invitation
 */
export async function getServerSideProps({ query }) {
  const data = await api.post('/v1/company/data', { id: query.id });
  return { props: { data, id: query.id } };
}

export default subscribe()(Enroll);
