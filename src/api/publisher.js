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

export const deletePublisher = (ids) => request({
    method: 'DELETE',
    url: '/publisher',
    data: {ids: ids}
})

export const createPublisher = (data) => request({
    method: 'POST',
    url: '/publisher',
    data
})
