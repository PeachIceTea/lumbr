import axios from "axios"
import { address } from "../../shared/config"

const axiosInstance = axios.create({
    baseURL: address,
})

export default axiosInstance
