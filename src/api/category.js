import request from "../utlis/request"

export const listCategory = (params) => request({
    method: 'GET',
    url: '/categories',
    params
})

export const getCategory = (id) => request({
    method: 'GET',
    url: '/categories/'+id,
})

export const updateCategory = (data) => request({
    method: 'PATCH',
    url: '/categories',
    data
})

export const deleteCategory = (data) => request({
    method: 'DELETE',
    url: '/categories',
    data
})

export const createCategory = (data) => request({
    method: 'POST',
    url: '/categories',
    data
})