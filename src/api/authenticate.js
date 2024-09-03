import { api } from "./api";

export const authenticate = ({ email, password }) => api.post('/api/manager/login', {
    email, password
})

