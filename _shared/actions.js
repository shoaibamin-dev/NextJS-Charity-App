export const toggleNavigation = (open) => state => {

  if (typeof open === 'undefined') {
    return {
      navigation: !state.navigation
    }
  }

  return { navigation: open }
}

export const setSettings = (data) => state => {

  return {
    settings: {
      ...state.settings,
      loaded: true,
      data
    }
  }
}

export const setSession = (token, data) => state => {

  return {
    session: {
      ...state.session,
      loggedIn: true,
      token,
      data
    }
  }
}

export const resetSession = () => state => {

  return {
    session: {
      loggedIn: false,
      token: false,
      data: {}
    }
  }
}
