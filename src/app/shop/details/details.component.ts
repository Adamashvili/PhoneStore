import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ProductsAreaService } from '../../services/products-area.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../interfaces/product';
import { SignErrComponent } from '../../sign-err/sign-err.component';
import { ToolsService } from '../../services/tools.service';
import { ApiAreaService } from '../../services/api-area.service';
import { CartAreaService } from '../../services/cart-area.service';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-details',
  imports: [CommonModule, SignErrComponent, RouterLink, SpinnerComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  constructor(
    private actR: ActivatedRoute,
    private service: ProductsAreaService,
    public router: Router,
    public tools: ToolsService,
    private _cookie: CookieService,
    private apiArea: ApiAreaService,
    private cartServ: CartAreaService,
  ) {}

  ngOnInit(): void {
    this.getParam();
  }
  @ViewChild('addShow') addShow!: ElementRef;
  @ViewChildren('rateStar') allStars!: QueryList<ElementRef>;
  public prodINFO = signal<any>({});
  public mainImage!: string;
  public allImages!: string[];
  public starNum!: number;
  public prodQuant: number = 1;
  public isRateCardShown: boolean = false;
  public rateNum!: number;
  public altImage: string =
    'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=';

  getParam() {
    this.actR.params.subscribe((data: Params) => {
      this.service.getProductDetailInfo(data['id']).subscribe((data: any) => {
        this.prodINFO.set(data.data);
        this.mainImage = data.data.images[0];
        this.allImages = data.data.images;
        this.starNum = Math.round(data.rating);
      });
    });
  }

  zoomImg(currImg: string) {
    this.mainImage = currImg;
  }

  updateQuantity(action: string) {
    action == '+' ? this.prodQuant++ : this.prodQuant--;
  }

  errorSMS() {
    this.tools.isErrSMS.next(true);
  }

  cartBTN(id: string) {
    if (this._cookie.get('user')) {
      const prodInfoCart = {
        productId: id,
        quantity: this.prodQuant,
      };

      // let n8nObj = {
      //   userName: JSON.parse(this._cookie.get('userInfo')).firstName,
      //   email: JSON.parse(this._cookie.get('userInfo')).email,
      //   token: this._cookie.get('user')
      // }

      // this.cartServ.n8nPost(n8nObj).subscribe()

      this.cartServ
        .addtoCart(prodInfoCart)
        .subscribe((data: any) =>
          this.cartServ.getCart().subscribe((cartData: any) => {
      this.tools.cartQuantity.set(cartData.data.products.length);
    })
        );
    
    } else {
      this.tools.isErrSMS.next(true);
    }
  }

  chooseRate(rateNum: number) {
    this.allStars.forEach((item) => {
      if (rateNum >= item.nativeElement.id) {
        item.nativeElement.style.color = '#FEB602';
      }
    });
  }

  resetStars() {
    this.allStars.forEach((item) => {
      item.nativeElement.style.color = '#666666';
    });
  }

  enterRate() {
    const rateInfo = {
      productId: this.prodINFO()._id,
      rate: this.rateNum,
    };

    this.service
      .rate(rateInfo)
      .subscribe((data: any) => this.prodINFO.set(data));
  }
}
