import request from "../utlis/request"

export const searchCharacter = (data, params) => request({
    method: 'POST',
    url: '/character/search',
    data,
    params
})
