import request from "../utlis/request"

export const searchCharacter = (data, params) => request({
    method: 'POST',
    url: '/character/search',
    data,
    params
})

export const getCharacter = (id) => request({
    method: 'GET',
    url: `/character/${id}`,
})

export const updateCharacter = (data) => request({
    method: 'PATCH',
    url: '/character',
    data
})

export const deleteCharacter = (data) => request({
    method: 'DELETE',
    url: '/character',
    data
})