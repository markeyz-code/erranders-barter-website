import { GATEWAY_ENDPOINT } from '../axios.config';

export const business_api = {
    getBySubdomain: (subdomain: string) => {
        const url = `/businesses/subdomain/${subdomain}`
        return GATEWAY_ENDPOINT.get(url)
    },
    
    getStorefront: (subdomain: string) => {
        const url = `/businesses/storefront/${subdomain}`
        return GATEWAY_ENDPOINT.get(url)
    }
}
