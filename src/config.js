const local = {
    api_base_url: 'http://localhost:8081/api'
}

const prod = {
    api_base_url: 'https://magnificent-gray-ox.cyclic.app/api'
}

export const config = process.env.REACT_APP_ENV === 'production' ? prod : local