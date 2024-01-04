import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH } from 'react-icons/fa';
import { useRouter } from 'next/router'
import * as api from '@/_shared/libs/api';
import { useSession } from '@/_shared/hooks';
import ErrorPage from 'next/error';

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
  Loader,
  Collapsible
} from '@/_shared/ui';

const Enroll = (props) => {

  // Next Router
  const router = useRouter()

  // States
  const [ loading, setLoading ] = useState(false);
  const [ business, setBusiness ] = useState(false);
  const [ currentScreen, setCurrentScreen ] = useState('signup');
  const [ email, setEmail ] = useState('');
  const { session, sessionLoading } = useSession(props);
  const [ pageLoading, setPageLoading ] = useState(true);
  const [ workplaceGiving, setWorkplaceGiving ] = useState(false);

  useEffect(() => {
    if (!sessionLoading) {
      if (session) {
        //router.push('/dashboard')
      } else {
        setPageLoading(false);
      }
    }
  }, [ session, sessionLoading ]);

  /**
   * Resend the email
   */
  const resendEmail = async () => {
    if (!email) {
      props.openSnackbar('Unable to send confirmation email.');
      return false;
    }

    setLoading(true);

    // Do the request
    const res = await api.post('/v1/user/resend-confirmation', { email });

    // if not successful
    if (res.sucess === false) {
      console.log(res);
      props.openSnackbar('Confirmation email unable to be resent', 'error');
      return false;
    }

    props.openSnackbar('Confirmation email resent');
    setLoading(false);
  }

  /**
   * Submit the form
   */
  const submit = async (data) => {

    // Set loading
    setLoading(true);

    const { fields } = data;

    /**
     * Validations for fields.
     */

    if (!fields.first_name) {
      props.openSnackbar('First name is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.last_name) {
      props.openSnackbar('Last name is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.email) {
      props.openSnackbar('Email is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.birthday) {
      props.openSnackbar('Birthday is required', 'error');
      setLoading(false);
      return false;
    }

    if (fields.birthday.includes('_')) {
      props.openSnackbar('Please enter a valid birthday', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.address) {
      props.openSnackbar('Address is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.city) {
      props.openSnackbar('City is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.state) {
      props.openSnackbar('State is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.postal_code) {
      props.openSnackbar('Postal code is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.password) {
      props.openSnackbar('Password is required', 'error');
      setLoading(false);
      return false;
    }

    if (!fields.confirm_password) {
      props.openSnackbar('Confirming your password is required', 'error');
      setLoading(false);
      return false;
    }

    /**
     * Do the two passwords match?
     */

    if (fields.confirm_password !== fields.password) {
      props.openSnackbar('You did not confirm your password correctly.', 'error');
      setLoading(false);
      return false;
    }

    try {

      fields.workplace_giving_enabled = (workplaceGiving ? 1 : 0);
      fields.companyId = props.id;

      // Do the request
      const res = await api.post('/v1/user/signup', fields, true);

      // if not successful
      if (res.success === false) {
        props.openSnackbar(res.message, 'error');
        setLoading(false);
        return false;
      }

      // Show the confirmation screen
      setLoading(false);
      setCurrentScreen('verify');
      setEmail(res.email);
      return true;

    } catch (error) {
      props.openSnackbar('Unable to signup.', 'error');
      setLoading(false);
      return false;
    }
  }

  if (!props.data.success) {
    return (
      <ErrorPage statusCode={404} />
    )
  }

  // if (sessionLoading || !sessionLoading && session) {
  //   return (<Document.Header />)
  // }

  if (currentScreen === 'verify') {
    return (
      <>
        <Document.Header title="Signup" />
        <Layouts.Signup>
          <PageHeader steps={[ 'Sign Up', 'Verify', 'Accept Terms' ]} active={(currentScreen === 'verify' ? 1 : 0)} />
          <Box titleSize={30} title={`Confirm your Email`}>
            <h3>A confirmation email has been sent to you at <strong>{email}</strong></h3>
            <p>Please click the activation link in the email to continue your account signup.</p>
            <p>Please check your spam folder if you do not receive an email within the next 5 minutes and make sure "@gvng.org" is approved for future communications. If you have questions or issues please contact <a href="mailto:support@gvng.org">support@gvng.org</a></p>
            <br /><br />
            <Button type={`button`} onClick={resendEmail} loading={loading} inline>Resend Email</Button>&nbsp;&nbsp;<Button type={`link`} href="mailto:support@gvng.org" inline>Contact Support</Button>
          </Box>
        </Layouts.Signup>
      </>
    )
  }

  return (
    <>
      <Document.Header title="Signup" />
      <Layouts.Signup>
        <PageHeader steps={[ 'Sign Up', 'Verify', 'Accept Terms' ]} active={(currentScreen === 'verify' ? 1 : 0)} />
        <Box titleSize={30} title={`Enrollment for ${props.data.name}`} loading={loading}>
          <Grid.Row>
            <Grid.Col m={12} t={12} d={9}>
              <Form.Wrapper onSubmit={submit}>
                {
                  /**
                <Grid.Row>
                  <Grid.Col m={12} t={4} d={4}>
                    <Form.Switch width={120} enabled="Business" disabled="Individual" onClick={checked => setBusiness(checked)} name="business_account" label="Account Type" />
                  </Grid.Col>
                  {
                    business && (
                      <>
                        <Grid.Col m={12} t={4} d={4}>
                          <Form.Input name="business_name" label="Business Name" fullWidth={true} type="text" />
                        </Grid.Col>
                        <Grid.Col m={12} t={4} d={4}>
                          <Form.Input name="business_fein" label="FEIN Number" fullWidth={true} type="text" />
                        </Grid.Col>
                      </>
                    )
                  }
                </Grid.Row>
                {
                  business && (
                    <Grid.Row>
                      <Grid.Col m={12} t={4} d={4}>

                      </Grid.Col>
                      <Grid.Col m={12} t={8} d={8}>
                        <Form.Checkbox name="workplace_giving_enabled" onChange={(c) => setWorkplaceGiving(c)} label={<>Enable Workplace Giving <a href="#" style={{marginLeft: 20}}>Learn more</a></>} />
                      </Grid.Col>
                    </Grid.Row>
                  )
                }
                <hr />
                **/ }
                <Grid.Row>
                  <Grid.Col m={12} t={3} d={3}>
                    <Form.Input name="first_name" label="First Name" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={2} d={2}>
                    <Form.Input name="middle_name" label="Middle Initial" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={3} d={3}>
                    <Form.Input name="last_name" label="Last Name" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={3} d={3}>
                    <Form.Input name="title" label="Title" fullWidth={true} type="text" />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input name="email" label="Email" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input name="birthday" label="Birthday" fullWidth={true} type="text" pattern="99/99/9999" />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col m={12} t={3} d={3}>
                    <Form.Input name="address" label="Address" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={3} d={3}>
                    <Form.Input name="city" label="City" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={3} d={3}>
                    <Form.Select
                      name="state"
                      label="State"
                      fullWidth={true}
                      options={props.states}
                    />
                  </Grid.Col>
                  <Grid.Col m={12} t={3} d={3}>
                    <Form.Input name="postal_code" label="Postal Code" fullWidth={true} type="text" />
                  </Grid.Col>
                </Grid.Row>
                <hr />
                <Grid.Row>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input name="password" label="Password" fullWidth={true} type="password" />
                  </Grid.Col>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input name="confirm_password" label="Confirm Password" fullWidth={true} type="password" />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col m={12} t={12} d={12}>
                    <Button type={`link`} href="/" theme={`secondary`} inverted inline>Cancel</Button>&nbsp;&nbsp;
                    <Button type={`submit`} loading={loading} inline>Create Account</Button>
                  </Grid.Col>
                </Grid.Row>
              </Form.Wrapper>
            </Grid.Col>
            <Grid.Col m={12} t={12} d={3}>
              <Box paper={true}>
                <Collapsible title="How is my personal information handled?">
                  Your data is stored in a secure environment hosted on <a href={`https://aws.amazon.com/security/?nc=sn&loc=0`} target="_blank">AWS</a> and we use best efforts to maintain data security. More details can be found in our Privacy Policy.
                </Collapsible>
                <hr />
                <Collapsible title="Will my contact info be used for advertising?">
                  No, GVNG does not use or sell your information for advertising purposes.
                </Collapsible>
                <hr />
                <p>
                  Already started? Please check your email to confirm your email address or Contact Support if you’re having issues signing up
                </p>
              </Box>
            </Grid.Col>
          </Grid.Row>
        </Box>
      </Layouts.Signup>
    </>
  )
}

/**
 * Retrieve the campaign data on the server first.
 */
export async function getServerSideProps({ query }) {
  const states = await api.get('/v1/geo/states');
  const keys = Object.keys(states);
  const stateArray = keys.map(stateKey => {

    return {
      label: states[stateKey],
      value: stateKey
    };
  });

  const data = await api.post('/v1/company/data', { id: query.id });
  return { props: { states: stateArray, data, id: query.id } };
}

export default subscribe()(Enroll);
