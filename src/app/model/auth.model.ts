export interface UserRegister {
    username: string,
    email: string,
    password: string,
}

export interface UserLogin {
    email: string,
    password: string
}

export interface LoginResponse {
    message: string,
    access_token: string
}