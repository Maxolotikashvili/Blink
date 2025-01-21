export interface UserRegister {
    username: string,
    bio: string,
    email: string,
    password: string,
    avatar: string
}

export interface UserLogin {
    email: string,
    password: string
}

export interface LoginResponse {
    message: string,
    access_token: string
}