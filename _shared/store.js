import * as actions from './actions';

export default {

  navigation: false,

  session: {
    token: false,
    loggedIn: false,
    data: {}
  },

  settings: {
    loaded: false,
    data: {}
  },

  ...actions
};
