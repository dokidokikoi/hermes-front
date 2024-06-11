import request from "../utlis/request"

export const listDeveloper = (params) => request({
    method: 'GET',
    url: '/developer',
    params
})

export const getDeveloper = (id) => request({
    method: 'GET',
    url: '/developer/'+id,
})

export const updateDeveloper = (data) => request({
    method: 'PATCH',
    url: '/developer',
    data
})

export const deleteDeveloper = (ids) => request({
    method: 'DELETE',
    url: '/developer',
    data: {ids: ids}
})

export const createDeveloper = (data) => request({
    method: 'POST',
    url: '/developer',
    data
})