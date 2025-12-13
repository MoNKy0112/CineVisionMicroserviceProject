import axios from "axios";
import { registerUser, loginUser } from "./mockData";

export class UserService {

    apiUrl = "http://localhost:8080/api/user/users/"

    // RF5-RF6: Registro mockeado
    addCustomer(customer) {
        // Intenta usar el backend, si falla usa datos mockeados
        return axios.post(this.apiUrl + "add", customer)
            .catch(() => {
                try {
                    const newUser = registerUser(customer);
                    return Promise.resolve({ 
                        status: 200, 
                        data: newUser 
                    });
                } catch (error) {
                    return Promise.reject({ 
                        response: { 
                            status: 400, 
                            data: { message: error.message } 
                        } 
                    });
                }
            });
    }

    // RF7: Login mockeado
    login(loginDto) {
        // Intenta usar el backend, si falla usa datos mockeados
        return axios.post("http://localhost:8080/api/user/auth/login", loginDto)
            .catch(() => {
                try {
                    const user = loginUser(loginDto.email, loginDto.password);
                    return Promise.resolve({ 
                        status: 200, 
                        data: user 
                    });
                } catch (error) {
                    return Promise.reject({ 
                        response: { 
                            status: 401, 
                            data: { message: error.message } 
                        } 
                    });
                }
            });
    }
}