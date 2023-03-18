const axios = require('axios')

const getAuth0UserInfo = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  try {
    return await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, { headers }).then((r) => r.data)
  } catch (e) {
    throw e
  }
}

exports.getAuth0UserInfo = getAuth0UserInfo