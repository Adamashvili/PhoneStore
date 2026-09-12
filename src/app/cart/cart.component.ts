import { Component, signal } from '@angular/core';

import { CartAreaService } from '../services/cart-area.service';
import { ProductsAreaService } from '../services/products-area.service';
import { CommonModule } from '@angular/common';
import { ToolsService } from '../services/tools.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  constructor(
    private api: CartAreaService,
    protected prodServ: ProductsAreaService,
    protected tools: ToolsService,
    private _cookie: CookieService
  ) {
    this.getCart();
  }

  protected cartArray = signal<any[]>([]);
  protected totalPrice = signal<number>(0);

  getCart() {
    this.api.getCart().subscribe({
      next: (cartData: any) => {
        console.log(cartData.data.products);
        this.cartArray.set(cartData.data.products);
        // let cartFilteredList:any[] = []
        // this.prodServ.getCardsOnShopPage(1,38).subscribe( (fullList:any) => {
        this.tools.cartQuantity.set(cartData.data.products.length);
        //   let total = cartData.products.map( (item:any) => item.quantity * item.pricePerQuantity ).reduce((x:any, y:any) => x+ y)
        //   this.totalPrice.set(total)

        //   cartData.products.forEach( (cartItem:any) => {
        //     fullList.products.forEach( (fullCardItem:any) => {
        //       if(cartItem.productId == fullCardItem._id) {
        //         fullCardItem.quantity = cartItem.quantity
        //         cartFilteredList.push(fullCardItem)
        //       }

        //     } )
        //   } )
        //   this.cartArray.set(cartFilteredList)

        // } )
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  updateCart(id: string, action: string, prodQuantity: number) {
    action == '+' ? prodQuantity++ : prodQuantity--;

    const prodInfoCart = {
      productId: id,
      quantity: prodQuantity,
    };

    this.api
      .updateItemInCart(prodInfoCart)
      .subscribe((data: any) => this.getCart());
  }

  removeItem(id: string) {
    this.api.deleteProduct(id).subscribe(() => this.getCart());
  }


  buyAndSendSMS(item: string, quantity: string, id: string) {

   let sendObj = {
    userName: JSON.parse(this._cookie.get('userInfo')).firstName,
        email: JSON.parse(this._cookie.get('userInfo')).email,
        token: this._cookie.get('user'),
        quantity: quantity,
        item: item
    }

    this.api.n8nPost(sendObj).subscribe(() => this.removeItem(id))
  }
}
