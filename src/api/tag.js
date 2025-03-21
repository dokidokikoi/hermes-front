import request from "../utlis/request"

export const listTag = (params) => request({
    method: 'GET',
    url: '/tags',
    params
})

export const getTag = (id) => request({
    method: 'GET',
    url: '/tags/'+id,
})

export const updateTag = (data) => request({
    method: 'PATCH',
    url: '/tags',
    data
})

export const deleteTag = (data) => request({
    method: 'DELETE',
    url: '/tags',
    data
})

export const createTag = (data) => request({
    method: 'POST',
    url: '/tags',
    data
})
