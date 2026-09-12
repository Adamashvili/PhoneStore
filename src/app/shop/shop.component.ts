import { Component, OnInit, signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductsAreaService } from '../services/products-area.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';
import { AllProductArea } from '../../interfaces/all-product-area';
import { FilteredProducts } from '../../interfaces/filtered-products';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [SidebarComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  constructor(private prodService: ProductsAreaService) {}

  ngOnInit(): void {
    this.showProducts(this.currentPage);
  }

  public currentCategory: any;
  public productList = signal<any[]>([]);
  public maxPage: number = 1;
  public currentPage: number = 1;
  public pageSize: any = 15;
  public totalSize!: any;
  public isCategoryShown: boolean = false;
  public altImage: string =
    'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=';

  pagination(data: any | AllProductArea) {
    this.productList.set(data.data);
    let pages = Math.ceil(data.total / this.pageSize);
    this.maxPage = pages;
  }

  showProducts(page: number | string = 1) {
    this.isCategoryShown = false;
    this.currentPage = +page;
    this.prodService
      .getCardsOnShopPage(page)
      .subscribe((data: any) => {
        console.log(data.data);
        
        this.productList.set(data.data);
        this.totalSize = data.total;
        this.pagination(data);
      });
  }

  search(search: string) {
    this.prodService
      .getSearchedData(search)
      .subscribe((data: any) => {
        this.productList.set(data.data);
        this.pagination(data);
      });
  }

  filterProducts(info: any) {
    console.log(info);

    this.prodService
      .filterData(
        info.search,
        info.rating,
        info.min,
        info.max,
        info.type,
        info.sort,
        this.pageSize,
        info.brand,
      )
      .subscribe((data: any) => {
        console.log(data);

        this.productList.set(data.data);
        this.pagination(data);
      });
  }

  switchBrands(dataOfBrand: any) {
    this.productList.set(dataOfBrand.data);
  }

  showByCategory(category: string, pageNum: any) {
    this.isCategoryShown = true;
    this.currentCategory = category;
    this.currentPage = pageNum;
    this.prodService
      .getListByCategory(category, this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        this.productList = data.products;
        this.pagination(data);
      });
  }
}
