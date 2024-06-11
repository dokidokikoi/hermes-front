import request from "../utlis/request"

export const Search = (data) => request({
    method: 'POST',
    url: `/scraper`,
    data
})

export const Scrape = (data) => request({
    method: 'Post',
    url: '/scraper/scrape',
    data
})

export const Get = (params) => request({
    method: 'GET',
    url: '/scraper',
    params
})

export const Bind = (data) => request({
    method: 'POST',
    url: '/scraper/bind',
    data
})

export const GetRef = (params) => request({
    method: 'GET',
    url: '/scraper/ref',
    params
})