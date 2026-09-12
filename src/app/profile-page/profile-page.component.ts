import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { ApiAreaService } from '../services/api-area.service';
import { CartAreaService } from '../services/cart-area.service';
import { ProductsAreaService } from '../services/products-area.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToolsService } from '../services/tools.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit, AfterViewInit {
  constructor(
    private api: ApiAreaService,
    private cartServ: CartAreaService,
    private prodServ: ProductsAreaService,
    private renderer: Renderer2,
    protected tools: ToolsService,
    public _cookie: CookieService,
  ) {}
  ngOnInit(): void {
    this.getProfileData();
  }

  ngAfterViewInit(): void {
    if (JSON.parse(this._cookie.get('userInfo'))) {
      this.userInfoNAV.set(JSON.parse(this._cookie.get('userInfo')))
      
    }
  }

  protected profileToUpdate: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    age: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    zipcode: new FormControl(''),
    avatar: new FormControl(''),
    gender: new FormControl(''),
  });

  protected passForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  public canChangeBio: boolean = false;
  public isPassFormShown: boolean = false;
  public userInfoNAV = signal<any>({});
  public isProfileInfoShown: boolean = false;
  public isResponseSMSShown: boolean = false;
  public responseSMS = signal<string>('');
  @ViewChild('settings') public settings!: ElementRef;

  toggleSettings() {
    this.settings.nativeElement.classList.toggle('settingShowHide');
  }

  showProfileInfo() {
    this.isProfileInfoShown = true;
  }

  closeProfileInfo(close: boolean) {
    this.isProfileInfoShown = close;
  }

  getProfileData() {
   
        this.profileToUpdate.patchValue({
          firstName: JSON.parse(this._cookie.get('userInfo')).firstName,
          lastName: JSON.parse(this._cookie.get('userInfo')).lastName,
          age: JSON.parse(this._cookie.get('userInfo')).age,
          avatar: JSON.parse(this._cookie.get('userInfo')).image,
          gender: JSON.parse(this._cookie.get('userInfo')).gender,
        });
     
    };
  

  updateBio() {
    this.api.updateProfile(this.profileToUpdate.value).subscribe({
      next: (data: any) => {
        this.tools.userNavbarInfo.set(data);
        this.canChangeBio = false;
        this.responseSMS.set('Profile Info Changed successfully');
        this.isResponseSMSShown = true;
        setTimeout(() => {
          this.isPassFormShown = false;
          this.isResponseSMSShown = false;
          this.responseSMS.set('');
        }, 1000);
      },
      error: (err: any) => {
        this.responseSMS.set(err.error.error);
        this.isResponseSMSShown = true;
        setTimeout(() => {
          this.isResponseSMSShown = false;
          this.responseSMS.set('');
        }, 1000);
      },
    });
  }

  updatePass() {
    this.api.changePass(this.passForm.value).subscribe({
      next: (data: any) => {
        this.responseSMS.set('Password Changed successfully');
        this._cookie.set('user', data.access_token, 1);
        this.isResponseSMSShown = true;
        setTimeout(() => {
          this.isResponseSMSShown = false;
          this.responseSMS.set('');
        }, 1000);
      },
      error: (err: any) => {
        this.responseSMS.set(err.error.error);
        this.isResponseSMSShown = true;
        setTimeout(() => {
          this.isResponseSMSShown = false;
          this.responseSMS.set('');
        }, 1000);
      },
    });
  }

  // cartListData() {
  //   this.cartList = [];
  //   this.cartServ.getCart().subscribe((data: any) => {
  //     data.products.forEach((cartItems: any) => {
  //       this.prodServ.getCardsOnShopPage(1).subscribe((data: any) => {
  //         data.products.forEach((item: any) => {
  //           if (item._id == cartItems.productId) {
  //             item.quantity = cartItems.quantity;
  //             this.cartList.push(item);
  //           }
  //         });
  //         let totalPrice = this.cartList
  //           .map((item: any) => item.price.current * item.quantity)
  //           .reduce((x, y) => x + y);
  //         this.total = totalPrice;
  //       });
  //     });
  //   });
  // }

  // deleteItem(id: string) {
  //   this.cartServ.deleteProduct({ id }).subscribe(() => this.cartListData());
  // }

  // removeALL() {
  //   this.cartServ.removeAll().subscribe((data: any) => {
  //     this.cartListData();
  //     this.total = 0;
  //   });
  // }

  // checkOut() {
  //   this.cartServ.checkOut().subscribe((data: any) => {
  //     this.cartSMS = data.message;

  //     this.cartList = [];
  //   });
  // }
}
