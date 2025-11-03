import {Component, OnInit} from '@angular/core';
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
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {Loader} from '../../../../_core/layout/loader/loader';
import {Image} from 'primeng/image';
import {ParamService} from '../../../../_core/services/param-service';
import {SelectItem} from '../../../../_core/dto/selectItem';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';
import {Product} from '../../../../_core/dto/product';
import {ERole} from '../../../../_core/dto/eRole';
import {AuthService} from '../../../../_core/services/auth-service';

@Component({
  selector: 'app-product-list-component',
  imports: [
    CommonModule,
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
    AsideMenuComponent,
  ],
  templateUrl: './product-list-component.html',
  standalone: true,
  styleUrl: './product-list-component.css'
})
export class ProductListComponent implements OnInit {
  isLoading: boolean = false;
  products: Product[] = [];
  selectedProduct: Product | null = null;
  visible: boolean = false;
  allergenParams: SelectItem[] = [];
  typeParams: SelectItem[] = [];
  categoryParams: SelectItem[] = [];
  statusParams: SelectItem[] = [];
  isAdmin = false;
  isRestorer = false;

  constructor(protected productService: ProductService,
              private alertService: AlertService,
              private paramService: ParamService,
              private authService: AuthService) {
  }


  ngOnInit(): void {
    this.chefIfAdmin()
    this.loadProductCategory()
    this.loadProductAllergen()
    this.loadProductType()
    this.loadProductStatus()
    this.loadProducts()
  }

  chefIfAdmin() {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.isLoading = false;
        this.isAdmin = user.roles?.includes(ERole.ADMIN);
         this.isRestorer = user.roles?.includes(ERole.RESTORER);
      } else {
        this.isAdmin = false;
        this.isRestorer = false;
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.loadProducts(this.productService.productFilter)
      .subscribe({
        next: (res: ResponseWrapper<Product[]>) => {
          this.products = res.data;
          console.log("products : " + this.products)
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(`Error http when fetching products : ${err}`);
        }
      });
  }

  loadProductStatus() {
    this.isLoading = true;
    this.paramService.getApprovalStatuses()
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

  loadProductAllergen() {
    this.isLoading = true;
    this.paramService.getAllergens()
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

  loadProductType() {
    this.isLoading = true;
    this.paramService.getProductTypes()
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

  loadProductCategory() {
    this.isLoading = true;
    this.paramService.getProductCategories()
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

  showDialog(product: Product) {
    this.selectedProduct = product;
    this.visible = true;
  }

  closeDialog() {
    this.selectedProduct = null;
    this.visible = false;


  }


  updateApproval(selectedOffer: any, rejected: string) {

  }
}
