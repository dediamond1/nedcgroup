import { api } from "./api";

export const authenticate = ({ email, password }) => api.post('/api/auth/login', {
    email, password
})

