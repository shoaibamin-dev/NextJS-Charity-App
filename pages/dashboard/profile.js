import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH, FaBell, FaQuestion } from 'react-icons/fa';
import { useSession, useSettings } from '@/_shared/hooks';
import * as api from '@/_shared/libs/api';
import { useRouter } from 'next/router';

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
  DashboardTables
} from '@/_shared/ui';

const defaultNotifications = {
  campaign_donations: true,
  transaction_notes: true,
  daily_digest: true,
  weekly_digest: true,
  donation_completed: true,
  gvng_newsletter: true
};

/**
 * Responsible for displaying all things that are
 * user settings related.
 */
const Profile = (props) => {

  const router = useRouter();

  // Several states to keep track of
  const [ modalOpen, setModalOpen ] = useState(false);
  const { session, sessionLoading, retrieveSession } = useSession(props, { require: true });
  const { settings, settingsLoading } = useSettings(props, 'dashboard');
  const [ emailConfirmed, setEmailConfirmed ] = useState(props.session.data.email_confirmation_hash ? false : true);

  const [ notifications, setNotifications ] = useState(props.session.data.notifications || defaultNotifications);

  const handleNotificationChange = async (field, val) => {
    setNotifications({
      ...notifications,
      [field]: val
    });
  }

  useEffect(() => {
    if (session) {

      submit('notifications', {
        fields: notifications
      });
    }
  }, [ notifications ]);

  const submit = async (type, data) => {

    if (type === 'password') {

      if (!data.fields.password || !data.fields.confirm_password) {
        props.openSnackbar('Required fields are missing', 'error');
        return false;
      }

      if (data.fields.password !== data.fields.confirm_password) {
        props.openSnackbar('Passwords must match', 'error');
        return false;
      }
    }

    const res = await api.post('/v1/user/update', { type, fields: data.fields }, true);

    if (res === false) {
      props.openSnackbar('Unable to update settings.', 'error');
      return false;
    }

    if (type === 'password') {
      props.openSnackbar('Password changed, please login again.');

      const res = await api.logout();
      props.resetSession();
      router.push('/');

      return true;
    }

    if (type === 'email') {
      setEmailConfirmed(false);
    }

    await retrieveSession(true);

    props.openSnackbar(`Your ${type} ${type === 'notifications' ? 'where' : 'was'} updated successfully.`);
    return true;
  }

  // Set the header of the page
  const header = (
    <Document.Header title="Profile" />
  );

  // If the session is loading, only render the head
  if (sessionLoading || !sessionLoading && !session || settingsLoading) {
    return header
  }

  return (
    <>
      {header}
      <Layouts.Dashboard>
        <Section>
          <Grid.Row>
            <Grid.Col m={12} t={8} d={8}>
              <Form.Wrapper onSubmit={data => submit('details', data)} box={{
                paper: true,
                title: "Account Details"
              }}>
                <Grid.Row>
                  {
                    props.session.data.business_name && (
                      <Grid.Col m={12} t={6} d={6}>
                        <Form.Input listenForValueChange={true} value={`${props.session.data.business_name}`} label="Business Name" readOnly={true} fullWidth={true} type="text" />
                      </Grid.Col>
                    )
                  }
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input listenForValueChange={true} value={`${props.session.data.first_name} ${props.session.data.middle_name ? props.session.data.middle_name + ' ' : ''}${props.session.data.last_name}`} label="Name" readOnly={true} fullWidth={true} type="text" />
                  </Grid.Col>
                </Grid.Row>
                <hr />
                <Grid.Row>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input listenForValueChange={true} value={props.session.data.address} name="address" label="Address" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input listenForValueChange={true} value={props.session.data.city} name="city" label="City" fullWidth={true} type="text" />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input listenForValueChange={true} value={props.session.data.state} name="state" label="State" fullWidth={true} type="text" />
                  </Grid.Col>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input listenForValueChange={true} value={props.session.data.zipcode} name="zipcode" label="Zip" fullWidth={true} type="text" />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  {
                    props.session.data.employer !== false && (
                      <Grid.Col m={12} t={props.session.data.employer ? 4 : 6} d={props.session.data.employer ? 4 : 6}>
                        <Form.Input listenForValueChange={true} value={props.session.data.employer} label="Employer" fullWidth={true} type="text" disabled={true} />
                      </Grid.Col>
                    )
                  }
                  <Grid.Col m={12} t={props.session.data.employer ? 4 : 6} d={props.session.data.employer ? 4 : 6}>
                    <Form.Input listenForValueChange={true} value={props.session.data.phone} name="phone" label="Phone" fullWidth={true} type="text" />
                  </Grid.Col>
                  {
                    props.session.data.selected_account_role === 1 && (
                      <>
                        <Grid.Col m={12} t={props.session.data.employer ? 4 : 6} d={props.session.data.employer ? 4 : 6}>
                          <Form.Input listenForValueChange={true} disabled={true} value={props.session.data.dob} name="dob" label="Date of Birth" fullWidth={true} type="text" />
                        </Grid.Col>
                      </>
                    )
                  }
                </Grid.Row>
                <Button type="submit" key={0} theme={`primary`} fullWidth={false}>Update</Button>
              </Form.Wrapper>

              <Form.Wrapper
                box={{
                  paper: true,
                  title: (<>Email Address {props.session.data.esignature_status !== 'contract-signed' && <Label>Unconfirmed</Label>}</>)
                }}
                onSubmit={data => submit('email', data)}
              >
                <Grid.Row>
                  <Grid.Col m={12} t={12} d={12}>
                    <Form.Input listenForValueChange={true} value={props.session.data.email} name="email" label="Email Address" fullWidth={true} type="email" />
                  </Grid.Col>
                </Grid.Row>
                <Button type="submit" key={0} theme={`primary`} fullWidth={false}>Update Email</Button>
              </Form.Wrapper>

              <Form.Wrapper
                box={{
                  paper: true,
                  title: "Change Password"
                }}
                onSubmit={data => submit('password', data)}
              >
                <Grid.Row>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input name="password" label="Password" fullWidth={true} type="password" />
                  </Grid.Col>
                  <Grid.Col m={12} t={6} d={6}>
                    <Form.Input name="confirm_password" label="Confirm Password" fullWidth={true} type="password" />
                  </Grid.Col>
                </Grid.Row>
                <Button type="submit" key={0} theme={`primary`} fullWidth={false}>Change Password</Button>
              </Form.Wrapper>
              {
                props.session.data.selected_account_role === 1 && (
                  <DashboardTables.AuthorizedUsers openSnackbar={props.openSnackbar} />
                )
              }
            </Grid.Col>
            <Grid.Col m={12} t={4} d={4}>
            {
              props.session.data.selected_account_role === 1 && (
                <Form.Wrapper onSubmit={data => submit('successor', data)} box={{
                  paper: true,
                  title: "Successor"
                }}>
                  <Grid.Row>
                    <Grid.Col m={12} t={12} d={12}>
                      <Form.Input listenForValueChange={true} value={props.session.data.successor ? props.session.data.successor.first_name : ''} name="first_name" label="First Name" fullWidth={true} type="text" />
                      <Form.Input listenForValueChange={true} value={props.session.data.successor ? props.session.data.successor.last_name : ''} name="last_name" label="Last Name" fullWidth={true} type="text" />
                      <Form.Input listenForValueChange={true} value={props.session.data.successor ? props.session.data.successor.email : ''} name="email" label="Email Address" fullWidth={true} type="email" />
                    </Grid.Col>
                  </Grid.Row>
                  <Button type="submit" key={0} theme={`primary`} fullWidth={true}>Update</Button>
                </Form.Wrapper>
              )
            }
            <Box paper={true} title={`Email Preferences`}>
              <Grid.Row>
                <Grid.Col m={12} t={12} d={12}>
                  <Form.Checkbox
                    onChange={val => handleNotificationChange('campaign_donations', val)}
                    value={notifications.campaign_donations}
                    label="Campaign Donations"
                  />
                  <Form.Checkbox
                    onChange={val => handleNotificationChange('transaction_notes', val)}
                    value={notifications.transaction_notes}
                    label="Transaction Notices"
                  />
                  <Form.Checkbox
                    onChange={val => handleNotificationChange('daily_digest', val)}
                    value={notifications.daily_digest}
                    label="Daily Digest"
                  />
                  <Form.Checkbox
                    onChange={val => handleNotificationChange('weekly_digest', val)}
                    value={notifications.weekly_digest}
                    label="Weekly Digest"
                  />
                  <Form.Checkbox
                    onChange={val => handleNotificationChange('donation_completed', val)}
                    value={notifications.donation_completed}
                    label="Donation Completed"
                  />
                  <Form.Checkbox
                    onChange={val => handleNotificationChange('gvng_newsletter', val)}
                    value={notifications.gvng_newsletter}
                    label="GVNG Newsletter"
                  />
                </Grid.Col>
              </Grid.Row>
            </Box>
            </Grid.Col>
          </Grid.Row>
        </Section>
      </Layouts.Dashboard>
    </>
  )
}

export default subscribe()(Profile);
