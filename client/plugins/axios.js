import axios from "axios"
import { address } from "../../shared/config"

export default axios.create({
    baseURL: address,
})
