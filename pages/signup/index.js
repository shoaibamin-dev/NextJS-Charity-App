import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH } from 'react-icons/fa';
import { useRouter } from 'next/router'
import * as api from '@/_shared/libs/api';
import { useSession } from '@/_shared/hooks';

import Switch from "react-switch";



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

import {GVNGLogo} from '@/_shared/ui';

import { Container, Row, Col } from 'reactstrap';

import React from 'react';
import AddressAutoComplete from './autocomplete';
import { zip } from 'lodash';

const Home = (props) => {

  // Next Router
  const router = useRouter()

  // States
  const [ loading, setLoading ] = useState(false);
  const [ business, setBusiness ] = useState(false);
  const [ currentScreen, setCurrentScreen ] = useState('signup');
  const [ email, setEmail ] = useState('');
  const { session, sessionLoading } = useSession(props);
  const [ pageLoading, setPageLoading ] = useState(true);
  const [test,setTest] = useState(true)

  // Autocomplete states
  const [ city, setCity ] = useState('');
  const [ state, setState ] = useState('');
  const [ postal, setPostal ] = useState('');
  const [ address, setAddress ] = useState('');

  

  useEffect(() => {
    if (!sessionLoading) {
      if(session) {
        router.push('/dashboard')
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

    let      { fields } = data;
   
    fields = {...fields, state, city, address, postal_code:postal}
    
    console.log("fields", fields)

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

    
      

    

      // Do the request
      const res = await api.post('/v1/user/signup', fields, true);

      // if not successful
      if (res.success === false) {
        props.openSnackbar(res.message, 'error');
        setLoading(false);
        return false;
      }

      console.log('email', res.email)
      console.log('es', res)
    
      
      // Show the confirmation screen
      setLoading(false);
      setCurrentScreen('verify');
      setEmail(fields.email);
      return true;

    } catch (error) {
      props.openSnackbar('Unable to signup.', 'error');
      setLoading(false);
      return false;
    }
  }

  if (sessionLoading || !sessionLoading && session) {
    return (<Document.Header />)
  }



  const changeBusinessStatus = () => {

    //setTest(!test);
    setBusiness(!business)

  }

  const updateRegions = (short_address, city, country, zip_code,state) => {

  
    
    setAddress(short_address);
    setCity(city);
    setPostal(zip_code);
    setState(state);


  }

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
    
        
        
        
        <Box loading={loading}>
          <GVNGLogo style={{display:'block', float:'left'}} className="logo"/>
          
          {
      <PageHeader className="mt-3 w-100 my-0 mx-auto" steps={[ 'SIGN UP', 'VERIFY', 'ACCEPT TERMS' ]} active={(currentScreen === 'VERIFY' ? 1 : 0)} />
     }

         
        <div className="text-center mt-5">
      
         
    <h6>Account Type</h6>
        <Switch
        
         handleDiameter={20}
         onColor="#C71750"
         offColor="#b3b3b3"
          onChange={changeBusinessStatus}
          checked={business}
          className="react-switch border border-dark"
          height={35}
          width={210}
          checkedIcon={<div  style={{position:'absolute', top:2, left :40}}>
          <h4 style={{color:'white'}}>Business</h4>
          </div>}
          uncheckedIcon={<div style={{position:'absolute',  top:2, right :40}}>
          <h4 style={{color:'white'}}>Individual</h4>
          </div>}
        />
      
          </div>

          <Grid.Row>
           <Grid.Col m={12} t={12} d={9}>
           <Form.Wrapper onSubmit={submit}>
                

                  {
                    business && (
                      <div>
                  {/* <Row className="my-2 ">
                  <Col md={6} sm={12}>
                      <Form.Input type="text" placeholder="Account Title" name="title" className="w-95"/>
                      </Col>

                        <Col md={6} sm={12} className="text-center mt-sm-0 mt-1 ">
                        <Form.Checkbox  label="Enable Workplace Giving " placeholder="Enable Workplace Giving " name="enable_workspace_giving" className="w-95  float-right "/>
                      

                        </Col>
                        </Row> */}

<Row>
                        <Col md={4} sm={12}>
                          <Form.Input className="w-95" name="business_name" placeholder="Business Name" fullWidth={true} type="text" />
                        </Col>
                        <Col md={4} sm={12} className="mt-2 mt-md-0">
                          <Form.Input className="w-95 float-md-right" name="business_fein" placeholder="FEIN Number" fullWidth={true} type="text" />
                        </Col>
                        <Col md={4} sm={12} className=" mt-md-0 mb-sm-2 text-sm-center">
                          <Form.Checkbox className="m-2" label="Enable Workplace Giving " placeholder="Enable Workplace Giving " name="enable_workspace_giving" className="w-95  float-right "/>
                        </Col>
                        </Row>
                      </div>
                    )
                  }
              
              
                <Row className="mt-2 ">
                  <Col md={4} sm={12} className="">
                    <Form.Input name="first_name" className="w-95 float-md-left" placeholder="First Name" fullWidth={true} type="text" />
                  </Col>
                  {/* <Col md={4} sm={12} className="mt-2 mt-md-0">
                    <Form.Input placeholder="Middle Name" className="w-95" name="middle_name"  fullWidth={true} type="text" />
                  </Col> */}
                  <Col md={4} sm={12} className="mt-2 mt-md-0">
                    <Form.Input name="last_name"  className="w-95 float-md-right" placeholder="Last Name" fullWidth={true} type="text" />
                  </Col>
                </Row>
                <Row className="">

                  
                
                
                <Col sm={12} md={5} className="my-2 mt-sm-2">
                    
                    
                    <AddressAutoComplete updateRegions={updateRegions}/>
                    {/* <Form.Input  className="w-95" name="address" placeholder="Address" fullWidth={true} type="text" /> */}
                
                
                
                    </Col>


                  <Col sm={12} md={7} className="my-2 mt-sm-2">
                    

                  <Row >

                  <Col md={4} sm={12} className=" mt-md-0 ">
                    

                      <input disabled className="w-95 location-search-input"  name="city" placeholder="City" fullWidth={true} type="text" value={city}/>

                  </Col>
                  <Col md={4} sm={12} className=" mt-3 mt-md-0 ">
                    <input
                    disabled
                  className="w-95 location-search-input"
                      name="state"
                      placeholder="State"
                      fullWidth={true}
                      value={state}
                    />
                  </Col>
                  <Col md={4} sm={12} className=" mt-3 mt-md-0">
                    <input value={postal} disabled className="w-95 location-search-input" name="postal_code" placeholder="Postal Code" fullWidth={true} type="text" />
                  </Col>

                  </Row>

                  </Col>
               
                </Row>
               

                <Row className="my-2  mt-sm-2">
                  <Col md={4} sm={12}>
                  <Form.Input className="w-95"  name="phone" placeholder="Phone" fullWidth={true} type="text" />
              
                    </Col>
                  <Col md={4} sm={12} className="mt-2 mt-md-0">
                    <Form.Input className="w-95" name="birthday" placeholder="Birthday" fullWidth={true} type="text" pattern="99/99/9999" />
                  </Col>

                

                </Row>

                <Row className="mt-1 mt-sm-0">

                    <Col md={4} sm={12}>
    <Form.Input name="email" className="w-95"   placeholder="Email" fullWidth={true} type="text" />

                    </Col>

                  <Col md={4} sm={12} className="mt-2 mt-md-0">
                    <Form.Input className="w-95"   name="password" placeholder="Create Password" fullWidth={true} type="password" />
                  </Col>
                  <Col md={4} sm={12} className="mt-2 mt-md-0">
                    <Form.Input  className="w-95"   name="confirm_password" placeholder="Confirm Password" fullWidth={true} type="password" />
                  </Col>
                </Row>
              
                <Row className="mt-2 mb-0" >
                  <Col m={12} t={12} d={12}>
                    {//<Button type={`link`} href="/" theme={`secondary`} inverted inline>Cancel</Button>&nbsp;&nbsp;
                    }
                    <Button style={{width: '350px'}} type={`submit`} loading={loading}  className="hide-link mt-4 d-block m-auto text-center">Create Account</Button>
                  </Col>
                </Row>
              </Form.Wrapper>
            </Grid.Col>
       
          
          </Grid.Row>
        </Box>

        <div >

          
        <hr style={{border: '1px solid gray'}}/>

        <a style={{ cursor: 'pointer', textAlign:'center',
    display: 'block',
    fontSize: '17px'}} onClick={() => router.push('/')} className="global--primary ">Already have an account? <b>SIGN IN</b></a>
        </div>
        
      </Layouts.Signup>
    </>
  )
}

/**
 * Retrieve the campaign data on the server first.
 */
export async function getServerSideProps() {
  const states = await api.get('/v1/geo/states');
  const keys = Object.keys(states);
  const stateArray = keys.map(stateKey => {

    return {
      label: states[stateKey],
      value: stateKey
    };
  });
  return { props: { states: stateArray } };
}

export default subscribe()(Home);
