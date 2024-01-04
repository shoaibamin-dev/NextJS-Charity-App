import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import { FaEllipsisH } from 'react-icons/fa';
import { useSession } from '@/_shared/hooks';
import * as api from '@/_shared/libs/api';
import { useRouter } from 'next/router'

import { Document, Button, Paper, Form, Box, Section, Grid, PageHeader, Card, Modal, List, Layouts, Tooltip, Loader } from '@/_shared/ui';

import {GVNGLogo} from '@/_shared/ui'

const Home = (props) => {

  const router = useRouter()

  const [ modalOpen, setModalOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ pageLoading, setPageLoading ] = useState(true);
  const { session, sessionLoading } = useSession(props);

  useEffect(() => {
    if (!sessionLoading) {
      if (session) {
        router.push('/dashboard')
      } else {
        setPageLoading(false);
      }
    }
  }, [ session, sessionLoading ]);

  const [ data, setData ] = useState({
    email: '',
    password: ''
  });

  const fakeLoad = () => {
    setLoading(true);

    setTimeout(() => {
      router.push('/dashboard');
        setLoading(false);
    }, 2000);
  }

  const login = async () => {
    setLoading(true);

    if (!data.email) {
      props.openSnackbar('Please provide an email', 'error');
      setLoading(false);
      return;
    }

    if(!data.email.includes('@') ){
      props.openSnackbar('Invalid email', 'error');
      setLoading(false);
      return;
    }

    if (!data.password) {
      props.openSnackbar('Please provide a password', 'error');
      setLoading(false);
      return;
    }

    if(data.password.length < 6){
      props.openSnackbar('Password should contain atleast 6 characters', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await api.login(data.email, data.password);

      if (res === false) {
        props.openSnackbar('Unable to login', 'error');
        setLoading(false);
        return;
      }

      props.openSnackbar('Logging in...', 'success');
      props.setSession(res.token, res.data);
      router.push('/dashboard');
      return true;
    } catch (error) {
      props.openSnackbar('Unable to login', 'error');
      setLoading(false);
      return;
    }
  }

  if (sessionLoading || !sessionLoading && session) {
    return (<Document.Header />)
  }

  return (
    <>
      <Document.Header />
      <Layouts.HeroLeft image={`/login-background.jpg`}>
        <Box
          style={{ maxWidth: '500px', width: '70%'}}
          paper={false}
          footer={[
            //<Button key={0} href="/signup" fullWidth={true} theme={`secondary`} inverted={true}>Sign Up</Button>,
            //<Button key={1} onClick={login} fullWidth={true} loading={loading}>Login</Button>
          ]}>
          <div className="logo-header mb-5">
          

          <GVNGLogo/>



          </div>
          <Form.Input
            value={data.email}
            onChange={val => setData({ ...data, email: val })}
      
            fullWidth={true}
            type="email"
            onKeyPress={e => { if (e.key === 'Enter') login() }}
            placeholder="Email"
            className="my-2 w-80 d-block m-auto"
          />
          <Form.Input
            value={data.password}
            onChange={val => setData({ ...data, password: val })}
            className="my-3 w-80 d-block m-auto"
            fullWidth={true}
            type="password"
            onKeyPress={e => { if (e.key === 'Enter') login() }}
            placeholder="Password"
          />
        

          <Button key={1} onClick={login} fullWidth={true}  className="mt-4 w-75 d-block m-auto text-center" loading={loading}>SIGN IN</Button>

          <a style={{ cursor: 'pointer', textAlign:'center',
    display: 'block',
    fontSize: '21px'}} onClick={() => router.push('/forgot')} className="global--primary mt-2">Forgot your password?</a>
        
        
    

<div className="mt-5">
        <hr style={{border: '1px solid gray'}}/>

        <a style={{ cursor: 'pointer', textAlign:'center',
    display: 'block',
    fontSize: '17px'}} onClick={() => router.push('/signup')} className="global--primary ">Don't have an account? <b>SIGN UP</b></a>
        </div>
        
        
        </Box>
      </Layouts.HeroLeft>
    </>
  )
}

export default subscribe()(Home);
