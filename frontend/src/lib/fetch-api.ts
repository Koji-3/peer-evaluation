import axios from 'axios'

export const get = async <T>(path: string, token: string): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  try {
    return await axios.get<T>(`${process.env.REACT_APP_API_ENDPOINT}${path}`, { headers }).then((r) => r.data)
  } catch (e: unknown) {
    throw e
  }
}

export const post = async <T, V>(path: string, token: string, data: V): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  try {
    return await axios.post<T>(`${process.env.REACT_APP_API_ENDPOINT}${path}`, data, { headers }).then((r) => r.data)
  } catch (e: unknown) {
    throw e
  }
}
