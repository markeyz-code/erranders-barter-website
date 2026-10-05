import axios from 'axios'; const ERRANDERS_CORE = axios.create({ baseURL: 'https://api.erranders.org' });

export const business_api = {
    getBySubdomain: (subdomain: string) => {
        const url = `/businesses/subdomain/${subdomain}`
        return ERRANDERS_CORE.get(url)
    },
    
    getStorefront: (subdomain: string) => {
        const url = `/businesses/storefront/${subdomain}`
        return ERRANDERS_CORE.get(url)
    }
}
