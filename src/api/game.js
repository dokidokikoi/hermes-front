import request from "../utlis/request"

export const createGame = (data, params) => request({
    method: 'PUT',
    url: '/game',
    data,
    params
})

export const updateGame = (data) => request({
    method: 'PATCH',
    url: '/game',
    data
})

export const searchGame = (data, params) => request({
    method: 'POST',
    url: '/game/search',
    data,
    params
})

export const getGame = (id, ver) => request({
    method: 'GET',
    url: `/game/ins`,
    params: {
        id: id,
        ver: ver
    }
})