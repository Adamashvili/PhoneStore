import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AllProductArea } from '../../interfaces/all-product-area';

@Injectable({
  providedIn: 'root'
})
export class ApiAreaService {

  constructor(private http: HttpClient) { }

  signIn(body: any) {
    return this.http.post("https://myphonesstore.onrender.com/api/v1/users/login", body)
  }

  register(body: any){
    return this.http.post("https://myphonesstore.onrender.com/api/v1/users/signup", body)
  }

  profileInfo() {
    return this.http.get("https://api.everrest.educata.dev/auth", {withCredentials: true})
  }

  updateProfile(body: any) {
    return this.http.patch("https://api.everrest.educata.dev/auth/update", body, {withCredentials: true})
  }

  changePass(body: any) {
    return this.http.patch("https://api.everrest.educata.dev/auth/change_password", body, {withCredentials: true})
  }
 
}
