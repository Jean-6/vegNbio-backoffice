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
import {Product, ProductFilter} from '../../../../_core/dto/product';
import {ERole} from '../../../../_core/dto/eRole';
import {AuthService} from '../../../../_core/services/auth-service';
import {Textarea} from 'primeng/textarea';
import {Status} from '../../../../_core/dto/canteen';
import {UserFilter} from '../../../../_core/dto/user';
import {Chip} from 'primeng/chip';

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
    Textarea,
    Chip,
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
  visibleRejectDialog = false;
  rejectReason = '';

  activeFilters: { key: keyof ProductFilter; label: string; value: string }[] = [];

  constructor(protected productService: ProductService,
              private alertService: AlertService,
              private paramService: ParamService,
              private authService: AuthService) {
  }


  ngOnInit(): void {
    this.chefIfAdmin()
    this.resetFilters();
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


  searchProducts(): void {
    const filter = this.productService.filter;
    if (filter.startDate && filter.endDate) {
      if (filter.startDate > filter.endDate) {
        this.alertService.warn("La date de début ne peut pas être supérieure à la date de fin.");
        return; // Bloque la recherche
      }
    }

    this.loadProducts();
  }

  loadProducts() {
    this.products = []
    this.isLoading = true;
    this.productService.loadProducts(this.productService.filter)
      .subscribe({
        next: (res: ResponseWrapper<Product[]>) => {
          this.products = res.data;
          this.updateActiveFilters()
          this.isLoading = false;
          //this.hasSearched = true;
        },
        error: (err: any) => {
          console.log(`Error http when fetching products : ${err}`);
          //this.hasSearched = true;
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

  showRejectDialog(product?: Product | null): void {
    //this.selectedProduct = product || null;
    if(!product) return ;
    this.rejectReason = '';
    this.visibleRejectDialog = true;
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


  approveProduct(selectedProduct: Product | null): void {
    if (!selectedProduct) return;

    this.isLoading = true;

    this.productService.approveProduct(selectedProduct).subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.success('Produit approuvé avec succès.');
        this.closeDialog();
        this.loadProducts();
        this.isLoading = false;
      },
      error: (error) => {

        this.alertService.error('Impossible d’approuver le produit.')
        console.error(error);
      },
    });
  }

  confirmReject(selectedProduct: Product | null): void {
    if (!selectedProduct?.id) return;

    if (!this.rejectReason.trim()) {
      this.alertService.error('Veuillez entrer une raison de rejet.');
      return;
    }

    this.isLoading = true;

    this.productService.rejectProduct(selectedProduct,this.rejectReason).subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.success('Produit rejeté avec succès.');
        this.closeDialog();
        this.loadProducts();
        this.isLoading = false;
      },
      error: (error) => {

        this.alertService.error('Impossible de rejeter le produit.')
        console.error(error);
      },
    });

  }


  updateActiveFilters(): void {
    const f = this.productService.filter;
    const filters: { key: keyof ProductFilter; label: string; value: string }[] = [];

    if (f.name) {
      filters.push({ key: 'name', label: 'Nom', value: f.name });
    }
    if (f.category && f.category.length > 0) {
      filters.push({
        key: 'category',
        label: 'Catégorie',
        value: f.category.join(', ')
      });
    }
    if (f.type && f.type.length > 0) {
      filters.push({
        key: 'type',
        label: 'Type',
        value: f.type.join(', ')
      });
    }
    if (f.startDate) {
      filters.push({
        key: 'startDate',
        label: 'Date début',
        value: f.startDate.toLocaleDateString()
      });
    }
    if (f.endDate) {
      filters.push({
        key: 'endDate',
        label: 'Date fin',
        value: f.endDate.toLocaleDateString()
      });
    }
    if (f.origin) {
      filters.push({
        key: 'origin',
        label: 'Origine',
        value: f.origin.join(', ')
      });
    }

    this.activeFilters = filters;
  }

  removeFilter(key: keyof ProductFilter): void {
    (this.productService.filter as any)[key] = key.endsWith('s') ? [] : undefined;
    this.loadProducts();
  }


  resetFilters(): void {
    this.productService.filter = {
      name: '',
      category: [],
      type: [],
      //minPrice: undefined,
      //maxPrice: undefined,
      //origin: [],
      startDate: undefined,
      endDate: undefined
    };
    this.activeFilters = [];
  }

  hasSearched: boolean = false;
  protected readonly Status = Status;
}
