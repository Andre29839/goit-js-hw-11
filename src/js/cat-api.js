const BASE_URL = "https://api.thecatapi.com"
const API_KEY = "live_wCfT5v0PWTplOiEB5XRfhZ2zfiCO2uEWJJyt9As1ajDN4YflBYPCsOYzgvezKYDC"

export function fetchBreeds() {
    return fetch(`${BASE_URL}/v1/breeds`, {
        headers: { "x-api-key": API_KEY }
    }).then((res) => {
        if (!res.ok) { throw new Error(res.status)
    }
        return res.json()
    })  
}

export function fetchCatByBreed(breedId) {
    return fetch(`${BASE_URL}/v1/images/search?breed_ids=${breedId}`, {
        headers: { "x-api-key": API_KEY }
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.status)
        }
        return res.json()
    })
}