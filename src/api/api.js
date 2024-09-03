import { create } from 'apisauce'
import { baseUrl } from '../constants/api'


export const api = create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': "application/json",
        Accept: "application/json"
    }
})

