import request from "../utlis/request"

export const createGame = (data, params) => request({
    method: 'PUT',
    url: '/game',
    data,
    params
})