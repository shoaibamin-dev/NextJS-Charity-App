import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss';
import { FaEllipsisH, FaBell, FaQuestion, FaChevronLeft } from 'react-icons/fa';
import { useSession, useSnackbar, useReadMore, useLoadScripts } from '@/_shared/hooks';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import ReadMoreReact from 'read-more-react';
import * as api from '@/_shared/libs/api';
import stripe from '@/_shared/libs/stripe';
import { loadStripe } from '@stripe/stripe-js';
import debounce from '@/_shared/functions/debounce';
import validateEmail from '@/_shared/functions/validateEmail';
import CreditCardInput from 'react-credit-card-input';
import _ from 'lodash';
import { PayPalButton } from "react-paypal-button-v2";
import countries from '@/_shared/data/billing-countries.json';

import {
  Document,
  Button,
  Form,
  Box,
  Section,
  Grid,
  PageHeader,
  Snackbar,
  Layouts,
  Donation,
  Tabs,
  Tooltip,
  Dropdown,
  Card
} from '@/_shared/ui';

/**
 * Responsible for handling the gateway to a donation for a
 * crowdfunding campaign.
 */
const Donate = (props) => {

  const router = useRouter();

  const buttonDisabledStyling = {
    cursor: 'not-allowed',
    opacity: 0.5
  }

  // Various states
  const { session, sessionLoading }   = useSession(props);
  const [ pageLoading, setPageLoading ] = useState(true);
  const [ loading, setLoading ] = useState(false);
  const { snackbar, openSnackbar }  = useSnackbar(2);
  const [ modalOpen, setModalOpen ] = useState(false);
  const { readMore } = useReadMore(props.campaign.summary);
  const [ donationModalOpen, setDonationModalOpen ] = useState(false);
  const [ coverFees, setCoverFees ] = useState(true);
  const [ donationAmount, setDonationAmount ] = useState(0.00);
  const [ totalAmount, setTotalAmount ] = useState(0.00);
  const [ totalFees, setTotalFees ] = useState(0.00);
  const [ method, setMethod ] = useState(0);
  const [ cardElement, setCardElement ] = useState(false);
  const [ feesId, setFeesId ] = useState(false);
  const [ currentScreen, setCurrentScreen ] = useState('donate');
  const [ paypalDetails, setPaypalDetails ] = useState(false);

  const [ buttonState, setButtonState ] = useState(false);

  if (!props.campaign) {
    return (<ErrorPage statusCode={404} />)
  }

  // Data state
  const [ data, setData ] = useState({
    email: '',
    fullName: '',
    cc: '',
    exp: '',
    cvc: '',
    zip: '',
    country: 'US',
    hidePublicInfo: false
  });

  useEffect(() => {
    if (props.campaign) {
      if (props.campaign.campaign_status === 'closed') {
        router.push(`/c/${props.campaign.slug}`);
      } else {
        setPageLoading(false);
      }
    }
  }, []);

  /**
   * Updates form data, will debounce call
   * the calcuation of fees depending on form inputs
   * changed.
   */
  const updateData = (field, val) => {

    setData({
      ...data,
      [field]: val
    });
  }

  // Remove tags from summary for SEO
  let taglessSummary = '';
  if (props.campaign) {
    taglessSummary = props.campaign.summary.replace(/(<([^>]+)>)/gi, "");
    taglessSummary = taglessSummary.length > 200 ? taglessSummary.substr(0, 197) + '...' : taglessSummary;
  }

  // Updates the donation amount
  const updateDonationAmount = amount => {
    setDonationAmount((parseFloat(amount)).toFixed(2));
  }

  /**
   * Debounces the fee calculation.
   */
  const calculateFees = useRef(
    _.debounce(async (method, donationAmount, data, coverFees) => {

      // Make sure donation is a float type
      let donation = parseFloat(donationAmount);

      // If stripe, do certain validations
      if (method === 0) {

        if (data.cc.length < 6) {
          // console.log('Stopped at cc')
          setTotalFees(0.00);
          return false;
        }

        if (data.country === 'US' && !data.zip) {
          // console.log('Stopped at zip')
          setTotalFees(0.00);
          return false;
        }
      }

      if (donation < 0.01) {
        // console.log('Stopped at donation amount')
        setTotalFees(0.00);
        return false;
      }

      const res = await api.post('/v1/donation/fees', {
        pl: (method === 0 ? 'stripe' : method === 1 ? 'paypal' : 'wallet'),
        a: donation,
        cn: data.cc.replace(' ', '').substring(0, 6),
        p: data.zip,
        c: data.country
      });

      // console.log('Response from fee calculation', res);

      if (res.fees_id) {
        setFeesId(res.fees_id);
      }

      setTotalFees((parseFloat(res.fee_total)));

      if (coverFees) {
        setTotalAmount(res.total_with_fees);
      } else {
        setTotalAmount(donation);
      }
    }, 1000)
  )

  useEffect(() => {

    // console.log(data);

  }, [ data.hidePublicInfo ]);


  const runValidations = () => {

    if (!data.fullName) {
      props.openSnackbar('Please provide your name', 'error');
      return false;
    }

    if (!validateEmail(data.email)) {
      props.openSnackbar('Please provide a valid email address.', 'error');
      return false;
    }

    if (data.country === 'US' && !data.zip) {
      props.openSnackbar('Please provide a postal code', 'error');
      return false;
    }

    return true;
  }

  /**
   * Submission
   *
   * 1. Generate card token
   * 2. Submit information to the API, and process
   */
  const submit = async () => {
    setLoading(true);

    if (!data.fullName) {
      props.openSnackbar('Please provide your name', 'error');
      setLoading(false);
      return false;
    }

    if (!validateEmail(data.email)) {
      props.openSnackbar('Please provide a valid email address.', 'error');
      setLoading(false);
      return false;
    }

    if (data.country === 'US' && !data.zip) {
      props.openSnackbar('Please provide a postal code', 'error');
      setLoading(false);
      return false;
    }

    try {

      // If the fee id does not exist, stop here.
      if (!feesId) {
        props.openSnackbar('Unable to process', 'error');
        return false;
      }

      /**
       * Processing stripe
       */
      if (method === 0) {

        const expirationParts = data.exp.replace(/\s+/g, '').split('/');

        // Creates the card token
        const res = await stripe.createCardToken({
          number: data.cc,
          cvc: data.cvc,
          exp_month: parseInt(expirationParts[0]),
          exp_year: parseInt(`20${expirationParts[1]}`)
        });

        // console.log('Created card token', res);

        // Contacts our API and processes the charge
        const processed = await api.post('/v1/donation/process', {
          pl: 'stripe',
          ct: res.id,
          cid: res.card.id,
          mask: res.card.last4,
          exp: { m: res.card.exp_month, y: res.card.exp_year },
          type: res.card.brand,
          a: donationAmount,
          campaign: props.campaign.slug,
          name: data.fullName,
          email: data.email,
          postal: data.zip,
          country: data.country,
          coverFees: coverFees,
          fees_id: feesId,
          hidePublicInfo: data.hidePublicInfo
        }, false, props);

        console.log('Processed response: ', processed);

        // If was not processed
        if (processed === false) {
          props.openSnackbar('Unable to process donation. Please check all details above and try again.', 'error');
          setLoading(false);
          return false;
        }

        // If processing failed, but a 200 was returned
        if (processed.status === 'failed') {
          props.openSnackbar('Unable to process donation. Please check all details above and try again.', 'error');
          setLoading(false);
          return false;
        }

      /**
       * Processing paypal
       */
      } else {

        // console.log('Submission determined this is paypal. Continuing.');

        /**
         * paypalDetails should never be false when we get here, however,
         * just to make sure, if it is, end it.
         */
        if (!paypalDetails) {
          props.openSnackbar('Unable to process donation.', 'error');
          setLoading(false);
          return false;
        }

        // Set data that we will send to the api.
        const orderId = paypalDetails.details.id;
        const payer = paypalDetails.details.payer;
        const status = paypalDetails.details.status;

        // Contacts our API and processes the charge
        const processed = await api.post('/v1/donation/process', {
          pl: 'paypal',
          a: donationAmount,
          campaign: props.campaign.slug,
          name: data.fullName,
          email: data.email,
          postal: data.zip,
          country: data.country,
          coverFees: coverFees,
          fees_id: feesId,
          order_id: orderId,
          payer: payer,
          status: status,
          hidePublicInfo: data.hidePublicInfo
        });

        // console.log('Paypal processed response: ', processed);

        // If was not processed
        if (!processed) {
          props.openSnackbar('Unable to process donation.', 'error');
          setLoading(false);
          return false;
        }

        // If processing failed, but a 200 was returned
        if (processed.status === 'failed') {
          props.openSnackbar('Unable to process donation.', 'error');
          setLoading(false);
          return false;
        }
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
      return false;
    }

    // Set the screen to "donated" message.
    setCurrentScreen('donated');

    // Reset the data
    setData({
      email: '',
      fullName: '',
      cc: '',
      exp: '',
      cvc: '',
      zip: '',
      hidePublicInfo: false
    });

    // Set the coverage of fees to false
    setCoverFees(false);

    // Set the method to stripe
    setMethod(0);

    // Remove loading.
    setLoading(false);
    return true;
  }

  /**
   * When amounts that affect the fee calculation changes,
   * call the debounced calculateFees function.
   * Once the info has changed for at least 1s, it will calculate a
   * new fee id to be sent during submission.
   */
  useEffect(() => {
    calculateFees.current(method, donationAmount, data, coverFees)

    if (donationAmount > 0.00 && data.cc && data.cvc && data.exp) {
      if (data.country === 'US' && !data.zip) {
        setButtonState(false);
      } else {
        setButtonState(true);
      }
    } else {
      setButtonState(false);
    }

  }, [ coverFees, method, donationAmount, data.zip, data.cc, data.cvc, data.country ]);


  /**
   * This method is called when paypal receives a response
   * from the payment modal. We do a check to make sure it's
   * completed, then we update the state, which we have a
   * listener for. Once it's updated, it will invoke "submit()"
   */
  const paypalCallback = (details, data) => {

    setLoading(true);

    // console.log('paypalCallback invoked');
    // console.log(details, data);

    if (details.status !== 'COMPLETED') {
      props.openSnackbar('Unable to process donation. Please try again.', 'error');
      setLoading(false);
      return false;
    }

    setPaypalDetails({
      details,
      data
    })
  }

  /**
   * Listens for paypal details to change.
   * If it has a value, then we can go ahead with
   * submission, as the only time this will change from
   * false is during the callback after paypal modal closes.
   */
  useEffect(() => {
    if (paypalDetails !== false) {
      // console.log('Paypal details set, invoking submit');
      submit();
    }
  }, [ paypalDetails ])

  // Set the tab titles
  const tabItems = [
    { title: 'Card' },
    { title: 'PayPal' }
  ];

  // if (session) {
  //   tabItems.push({ title: 'Wallet' });
  // }

  let image = props.campaign ? props.campaign.img : '';

  if (props.campaign.img) {
    if (!props.campaign.img.includes('http')) {
      image = `https://donate.gvng.org/files/${props.campaign.img}`;
    }
  }

  useEffect(() => {
    if (data.country !== 'US') {
      setCoverFees(false);
      updateData('zip', '');
    }
  }, [ data.country ]);

  const header = (
    <Document.Header title={`Support ${props.campaign && props.campaign.name}`}>
      <meta name="description" content={taglessSummary} />

      <meta name="og:title" content={props.campaign && props.campaign.name} />
      <meta name="og:type" content={`Crowdfunding Campaign`} />
      <meta name="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      <meta name="og:image" content={props.campaign && image} />
      <meta name="og:site_name" content="GVNGorg" />
      <meta name="og:description" content={taglessSummary} />

      <meta name="twitter:card" content={taglessSummary} />
      <meta name="twitter:title" content={props.campaign && props.campaign.name} />
      <meta name="twitter:description" content={taglessSummary} />
      <meta name="twitter:image" content={props.campaign && image} />
    </Document.Header>
  );

  if (pageLoading) {
    return (
      <>{header}</>
    );
  }

  return (
    <>
      {header}
      <Layouts.Campaign>
        <PageHeader extra={(
          <>
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center' }}>
              <Button key={0} type="link" href="https://www.gvng.org/" theme={`primary`} inverted={true} size="small">How it Works</Button>&nbsp;&nbsp;
              <Button key={1} type="link" href="/signup" theme={`primary`} inverted={true} size="small">Sign Up</Button>
            </div>
            <div className="show-mobile" style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown
                trigger={{
                  type: 'button',
                  label: (
                    <>Links</>
                  )
                }}
                items={[
                { label: 'How it Works', onClick: () => window.location.href = 'https://gvng.org' },
                { label: 'Sign Up', onClick: () => router.push('/signup') }
              ]} />
            </div>
          </>
        )} />
        <Section>
          <Grid.Row>
            {
              currentScreen === 'donated' ?
              (
                <>
                  <Grid.Col m={12} t={12} d={12}>
                    <Box style={{ maxWidth: 500, margin: '0 auto' }}>
                      <Card
                        image={image}
                        footer={[
                          <Button key={0} type="link" href={`/c/${props.campaign.slug}`} fullWidth={true}>Back to Campaign</Button>
                        ]}
                      >
                        <center>
                        <h3 style={{ marginTop: 0 }}>{props.campaign && props.campaign.name}</h3>
                        <p>Thank you for your donation!</p>
                        <hr />
                        You have donated <strong>${isNaN(totalAmount) ? 0.00 : totalAmount.toFixed(2)}</strong> to {props.campaign && props.campaign.name}.
                        <br /><br />
                        <small>You will recieve an email receipt for tax purposes. Donations will appear as GVNGORG on your statement.</small>
                        </center>
                      </Card>
                    </Box>
                  </Grid.Col>
                </>
              ) : (
                <>
                  <Grid.Col m={12} t={8} d={8}>
                    <Box paper={true} loading={loading}>
                      <Grid.Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid.Col m={3} t={3} d={3}>
                          <Button type="link" href={`/c/${props.campaign.slug}`} theme={`primary`} size="medium" inverted inline><FaChevronLeft />&nbsp;&nbsp;Back</Button>
                        </Grid.Col>
                        <Grid.Col m={9} t={9} d={9} style={{ textAlign: 'right' }}>
                          Donation to <strong>{props.campaign && props.campaign.name}</strong>
                        </Grid.Col>
                      </Grid.Row>

                      <hr />
                      <Donation.TitleBar campaign={props.campaign}><Donation.Input onChange={val => updateDonationAmount(val)} /></Donation.TitleBar>
                      <hr />
                      <h4>Payment Method</h4>
                      <Tabs items={tabItems} active={method} onChange={tabIndex => setMethod(tabIndex)} />
                      <hr style={{ marginTop: 15 }} />
                      {method !== 2 && (
                        <Grid.Row>
                          <Grid.Col m={6} t={6} d={6}>
                            <Form.Input onChange={val => updateData('fullName', val)} label="Full Name" fullWidth={true} />
                          </Grid.Col>
                          <Grid.Col m={6} t={6} d={6}>
                            <Form.Input onChange={val => updateData('email', val)} label="Email" fullWidth={true} />
                          </Grid.Col>
                        </Grid.Row>
                      )}
                      {method === 0 && (
                        <>
                          <Grid.Row>

                            <Grid.Col m={12} t={12} d={12}>
                              <CreditCardInput
                                cardNumberInputProps={{ value: data.cc, onChange: e => updateData('cc', e.target.value) }}
                                cardExpiryInputProps={{ value: data.exp, onChange: e => updateData('exp', e.target.value) }}
                                cardCVCInputProps={{ value: data.cvc, onChange: e => updateData('cvc', e.target.value) }}
                                fieldClassName="global--input-wrapper"
                                inputClassName="global--input"
                                containerStyle={{
                                  width: '100%'
                                }}
                                inputStyle={{
                                  width: '100%'
                                }}
                              />
                            </Grid.Col>
                          </Grid.Row>
                        </>
                      )}
                      {method !== 2 && (
                        <Grid.Row>
                          <Grid.Col m={6} t={6} d={6}>
                            <Form.NativeSelect label={`Country`} fullWidth={true} value={data.country} onChange={val => {
                              updateData('country', val);
                            }}>
                              {props.countries.map((country, index) => (
                                <option key={index} value={country.abbreviation}>
                                  {country.country}
                                </option>
                              ))}
                            </Form.NativeSelect>
                          </Grid.Col>
                          <Grid.Col m={6} t={6} d={6}>
                            {data.country === 'US' && (<Form.Input onChange={val => updateData('zip', val)} label="Postal Code" fullWidth={true} />)}
                          </Grid.Col>
                        </Grid.Row>
                      )}
                      <hr style={{ marginBottom: 15 }} />
                      <Grid.Row>
                        <Grid.Col m={12} t={6} d={6}>
                          <div style={{ width: '70%', maxWidth: '400px', textAlign: 'center', margin: '0 auto' }}>
                            <Form.Switch onChange={val => updateData('hidePublicInfo', val)} checked={data.hidePublicInfo} textAlign={`center`} label="Donate Anonymously" fullWidth={true} type="text" description={`Donating anonymously removes your name from being publicly visible on this campaign.`} />
                          </div>
                        </Grid.Col>
                        <Grid.Col m={12} t={6} d={6}>
                          <div style={{ width: '70%', maxWidth: '400px', textAlign: 'center', margin: '0 auto' }}>
                            <Form.Switch onChange={val => setCoverFees(val)} checked={coverFees} textAlign={`center`} label="Cover Fees" fullWidth={true} type="text" description={`I’d like to cover all transaction fees so 100% of my donation goes to this campaign.`} />
                          </div>
                        </Grid.Col>
                      </Grid.Row>
                      <hr style={{ marginBottom: 15 }} />
                      <center>
                        {
                          method === 0 ?
                          (
                            <Button style={buttonState === false ? buttonDisabledStyling : {}} onClick={() => buttonState === false ? null : submit()} loading={loading} type="button" key={0} theme={`primary`} fullWidth={false} inline>Continue{method === 0 ? '' : ' with PayPal'}</Button>
                          ) : method === 1 ? (
                            <PayPalButton
                              style={buttonState === false ? buttonDisabledStyling : {}}
                              amount={totalAmount}
                              onSuccess={paypalCallback}
                              onError={() => {
                                setLoading(false)
                              }}
                              onClick={() => {
                                if (!runValidations()) return false;
                                setLoading(true)
                              }}
                              onCancel={() => {
                                setLoading(false)
                              }}
                              options={{
                                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                                intent: "capture",
                                vault: true,
                                disableFunding: 'credit,card'
                              }}
                            />
                          ) :
                          (
                            <Button style={buttonState === false ? buttonDisabledStyling : {}} onClick={() => buttonState === false ? null : submit()} loading={loading} type="button" key={0} theme={`primary`} fullWidth={false} inline>Donate</Button>
                          )
                        }

                        <br />
                        <p style={{ maxWidth: 400, margin: '15px auto', fontSize: 10 }}>By donating you agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> for GVNGorg. GVNGorg is a 501(c)(3) tax-exempt organization (ID 81-2446261), a California nonprofit public benefit corporation. Donations are tax deductible to the fullest extent allowed by law.</p>

                      </center>
                    </Box>
                  </Grid.Col>
                  <Grid.Col m={12} t={4} d={4}>
                    <Box paper={true} title={'Details'} style={{ position: 'sticky', top: 100 }}>
                      <Grid.Row>
                        <Grid.Col m={6} t={6} d={6}>
                          Your donation
                        </Grid.Col>
                        <Grid.Col m={6} t={6} d={6} style={{ textAlign: 'right' }}>
                          ${isNaN(donationAmount) ? 0.00 : donationAmount}
                        </Grid.Col>
                      </Grid.Row>
                      {
                        coverFees && (
                          <Grid.Row>
                            <Grid.Col m={6} t={6} d={6}>
                              Fees
                            </Grid.Col>
                            <Grid.Col m={6} t={6} d={6} style={{ textAlign: 'right' }}>
                              ${totalFees.toFixed(2)}
                            </Grid.Col>
                          </Grid.Row>
                        )
                      }
                      <hr />
                      <Grid.Row>
                        <Grid.Col m={6} t={6} d={6}>
                          Total due today
                        </Grid.Col>
                        <Grid.Col m={6} t={6} d={6} style={{ textAlign: 'right' }}>
                          ${parseFloat(totalAmount).toFixed(2)}
                        </Grid.Col>
                      </Grid.Row>
                    </Box>
                  </Grid.Col>
                </>
              )
            }


          </Grid.Row>
        </Section>
        <Snackbar {...snackbar} />
      </Layouts.Campaign>
    </>
  )
}

/**
 * Retrieve the campaign data on the server first.
 */
export async function getServerSideProps({ query }) {
  const campaign = await api.post('/v1/campaign/slug', { slug: query.slug });
  return { props: { campaign, countries } };
}

export default subscribe()(Donate);
