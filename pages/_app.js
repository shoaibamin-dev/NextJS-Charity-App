import 'bootstrap/dist/css/bootstrap.css'

import { useEffect } from 'react';
import { Provider } from 'react-contextual';
import store from '@/_shared/store';
import '@/styles/globals.scss'

import { useSnackbar } from '@/_shared/hooks';
import { Snackbar } from '@/_shared/ui';

if (typeof window !== 'undefined') {

  /**
   * Redirect them to https is http is the current protocal
   */
  if (
    window.location.protocol !== 'https:' &&
    process.env.NEXT_PUBLIC_ENV === 'production'
  ) {
    window.location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }

  /**
   * Warn the user of potential console risks.
   */
  if (process.env.NEXT_PUBLIC_ENV === 'production') {
    const warningTitleCSS = 'color:red; font-size:60px; font-weight: bold; -webkit-text-stroke: 1px black;';
    const warningDescCSS = 'font-size: 18px;';

    console.log('%cStop!', warningTitleCSS);
    console.log("%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a feature or \"hack\" someone's account, it is a scam and will give them access to your GVNGorg account.", warningDescCSS);
  }
}

function MyApp({ Component, pageProps }) {

  const { snackbar, openSnackbar }  = useSnackbar(2);

  let props = {
    ...pageProps,
    snackbar,
    openSnackbar
  };

  return (
    <Provider {...store}>
      <Component {...props} />
      <Snackbar {...snackbar} />
    </Provider>
  );
}

export default MyApp
