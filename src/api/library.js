import request from "../utlis/request"

export const listLibrary = (params) => request({
    method: 'GET',
    url: '/library',
    params
})

