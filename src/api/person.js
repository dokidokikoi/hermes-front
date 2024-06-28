import request from "../utlis/request"

export const searchPerson = (data, params) => request({
    method: 'POST',
    url: '/person/search',
    data,
    params
})

export const upsertPerson = (data) => request({
    method: 'POST',
    url: '/person',
    data,
})

export const deletePerson = (data) => request({
    method: 'DELETE',
    url: '/person',
    data
})

export const getPerson = (id) => request({
    method: 'GET',
    url: `/person/${id}`
})