import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartAreaService {

  constructor(private http: HttpClient) { }

  getCart () {
    return this.http.get("https://myphonesstore.onrender.com/api/v1/cart",)
  }

  n8nPost(body: any) {
    return this.http.post("https://adamashvili888.app.n8n.cloud/webhook/0cec0281-c9cc-4764-8bad-1562d48f4b28", body, {headers: {accept: "*/*", "content-type": "application/json" }})
  }

  addtoCart(body: any) {
    return this.http.post("https://myphonesstore.onrender.com/api/v1/cart", body )
  }


  updateItemInCart(body: any) {
   return this.http.patch("https://myphonesstore.onrender.com/api/v1/cart", body)
  }


  deleteProduct(id: any) {
    return this.http.delete(`https://myphonesstore.onrender.com/api/v1/cart/${id}`)
  }

  // n8nbuy(body: any){
  //   return this.http.delete("https://adamashvili888.app.n8n.cloud/webhook-test/0cec0281-c9cc-4764-8bad-1562d48f4b28", body)
  // }

  // removeAll() {
  //   return this.http.delete("https://api.everrest.educata.dev/shop/cart")
  // }

  // checkOut() {
  //   return this.http.post("https://api.everrest.educata.dev/shop/cart/checkout", "")
  // }
}
