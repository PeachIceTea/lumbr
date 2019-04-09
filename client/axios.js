import axios from "axios"
import { address } from "../config"

const axiosInstance = axios.create({
    baseURL: address,
    validateStatus: false,
})

axiosInstance.setToken = function(token) {
    this.defaults.headers.authorization = token
}

axiosInstance.removeToken = function() {
    this.defaults.headers.authorization = null
}

export default axiosInstance
