import request from "../utlis/request"

export const listPublisher= (params) => request({
    method: 'GET',
    url: '/publisher',
    params
})

export const getPublisher = (id) => request({
    method: 'GET',
    url: '/publisher/'+id,
})

export const updatePublisher = (data) => request({
    method: 'PATCH',
    url: '/publisher',
    data
})

export const deletePublisher = (data) => request({
    method: 'DELETE',
    url: '/publisher',
    data
})

export const createPublisher = (data) => request({
    method: 'POST',
    url: '/publisher',
    data
})
