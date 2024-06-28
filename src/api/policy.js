import request from "../utlis/request"

export const listPolicy = () => request({
    method: 'GET',
    url: '/policy'
})

export const updatePolicy = (data) => request({
    method: 'PATCH',
    url: '/policy',
    data
})