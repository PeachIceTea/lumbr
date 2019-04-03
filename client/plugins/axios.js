import axios from "axios"
import { address } from "../../shared/config"

const axiosInstance = axios.create({
    baseURL: address,
})

axiosInstance.setToken = function(token) {
    this.defaults.headers.authorization = token
}

axiosInstance.removeToken = function() {
    this.defaults.headers.authorization = undefined
}

export default axiosInstance
