export const getDefaultApi = () => {
  if (process.env.USE_DEV === '1') {
    return process.env.REACT_APP_SERVER
  }

  const local = localStorage.getItem('api')
  if (local) {
    return local
  }

  if (!window.navigator.language.startsWith('zh')) {
    return 'https://api.chainx.org'
  }

  return 'https://api.chainx.org.cn'
}
