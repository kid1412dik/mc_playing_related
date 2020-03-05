import request from './request'

export function sendCostValue(cost) {
  return request({
    // url: '/home/multidata',
    params:{
      cost
    }
  })
}