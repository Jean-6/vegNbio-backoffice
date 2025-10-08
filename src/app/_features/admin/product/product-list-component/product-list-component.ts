import {Component, OnInit} from '@angular/core';
import {AdminAsideMenu} from '../../../../_core/layout/admin-aside-menu/admin-aside-menu';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {TableModule} from 'primeng/table';
import {ProductService} from '../../../../_core/services/product-service';
import {CommonModule} from '@angular/common';
import {AlertService} from '../../../../_core/services/alert-service';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {Offer} from '../../../../_core/dto/offer';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {Loader} from '../../../../_core/layout/loader/loader';
import {StatusOption} from '../../event/event-list-component/event-list-component';
import {Image} from 'primeng/image';


export interface AllergenOption {
  label: string;
  value: string;
}

export interface TypeOption{
  label: string;
  value: string;
}

export interface CategoryOption{
  label: string;
  value: string;
}
@Component({
  selector: 'app-product-list-component',
  imports: [
    CommonModule,
    AdminAsideMenu,
    DatePicker,
    FormsModule,
    InputText,
    MultiSelect,
    NavbarTop,
    TableModule,
    Loader,
    Button,
    Dialog,
    Image,
  ],
  templateUrl: './product-list-component.html',
  standalone: true,
  styleUrl: './product-list-component.css'
})
export class ProductListComponent implements OnInit{
  isLoading: boolean = false;
  offers: Offer[] = [];
  selectedOffer: Offer | null = null;
  visible: boolean =  false ;
  allergenParams: AllergenOption[] = [];
  typeParams: TypeOption[] = [];
  categoryParams: CategoryOption[] = [];
  statusParams: StatusOption[] = [];

  constructor(protected productService: ProductService,
              private alertService: AlertService) {}


  ngOnInit(): void {

    this.loadCategoryOptions()
    this.loadAllergenOptions()
    this.loadTypeOptions()
    this.loadProductStatus()
    this.loadProducts()
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.loadProducts()
      .subscribe({
        next: (res: ResponseWrapper<Offer[]>) => {
          this.offers = res.data;
          console.log("offers : "+this.offers)
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(`Error http when fetching offers : ${err}`);
        }
      });
  }

  loadProductStatus(){
    this.isLoading = true;
    this.productService.getEventStatus()
      .subscribe({
        next: options => {
          this.statusParams = options;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading status param:', err);
          this.alertService.error(`Error loading status param: ${err}`);
        }
      })
  }
  loadAllergenOptions(){
    this.isLoading = true;
    this.productService.getProductAllergens()
      .subscribe({
        next: options => {
          this.allergenParams = options;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading allergens param:', err);
          this.alertService.error(`Error loading allergens param: ${err}`);
        }
      })
  }

  loadTypeOptions(){
    this.isLoading = true;
    this.productService.getProductTypes()
      .subscribe({
        next: options => {
          this.typeParams = options;
          console.log(this.typeParams)
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading product type  param:', err);
          this.alertService.error(`Error loading product type param: ${err}`);
        }
      })
  }

  loadCategoryOptions(){
    this.isLoading = true;
    this.productService.getProductCategories()
      .subscribe({
        next: options => {
          this.categoryParams = options;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading product type  param:', err);
          this.alertService.error(`Error loading product type param: ${err}`);
        }
      })
  }

  showDialog(offer: Offer) {
    this.selectedOffer = offer;
    this.visible = true;
  }


  updateApproval(selectedOffer: any, rejected: string) {

  }
}
