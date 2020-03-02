import axios from 'axios'

export function request(condig){
  const instance = axios.create({
    baseURL:'',
    timeout:5000,
  })
}