import {Component, OnInit} from '@angular/core';
import {AlertService} from '../../../../_core/services/alert-service';
import {ParamService, SelectCanteen} from '../../../../_core/services/param-service';
import {MenuService} from '../../../../_core/services/menu-service';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {FormsModule} from '@angular/forms';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {AutoFocus} from 'primeng/autofocus';
import {Loader} from '../../../../_core/layout/loader/loader';
import {Drink, MenuItem, MenuItemFilter} from '../../../../_core/dto/menuItem';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {MultiSelect} from 'primeng/multiselect';
import {CommonModule, DecimalPipe} from '@angular/common';
import {Chip} from 'primeng/chip';
import {InputText} from 'primeng/inputtext';



@Component({
  selector: 'app-list-menu-component',
  imports: [
    CommonModule,
    AsideMenuComponent,
    NavbarTop,
    FormsModule,
    AutoComplete,
    AutoFocus,
    Loader,
    MultiSelect,
    DecimalPipe,
    Chip,
    InputText,
  ],
  templateUrl: './list-menu-component.html',
  standalone: true,
  styleUrl: './list-menu-component.css'
})
export class ListMenuComponent implements  OnInit{

  itemsMenu: MenuItem[] = [];
  isLoading: boolean = false;
  canteenParams: SelectCanteen[]=[];
  filteredCanteen: SelectCanteen[]=[];

  itemTypeOptions = [
    { label: "Boisson", value: "drink" },
    { label: "Dessert", value: "dessert" },
    { label: "Repas", value: "meal" },
    { label: "Entree", value: "appetizer" }
  ];


  activeFilters: { key: keyof MenuItemFilter; label: string; value: string }[] = [];

  constructor(protected menuService: MenuService,
              protected alertService: AlertService,
              protected  paramService: ParamService) {
  }

  ngOnInit(): void {
    this.resetFilters();
    this.initParam();
    this.loadItemMenu();
  }

  initParam(){
    this.loadCanteenParams()

  }

  isDrink(item: MenuItem): item is Drink {
    return item.itemType === 'drink';
  }

  searchCanteen(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredCanteen = this.canteenParams
      .filter(c => c.name.toLowerCase().includes(query))
      .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
  }

  loadCanteenParams(){
    this.isLoading = true;
    this.paramService.getCanteens()
      .subscribe({
        next: (options: ResponseWrapper<SelectCanteen[]>) => {
          this.canteenParams = options.data;
          this.filteredCanteen = [...options.data];
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading service param:', err);
          this.alertService.error(`Error loading service param: ${err}`);
        }
      })
  }


  loadItemMenu(){
    this.isLoading = true;
    this.menuService.getItemsMenu(this.menuService.itemMenuFilter).subscribe({
      next:(res: ResponseWrapper<MenuItem[]>) =>{
        this.itemsMenu = res.data;
        this.updateActiveFilters()
        this.isLoading = false;
      },
      error: (err)=> {
        console.error('Error loading itemMenu', err);
        this.alertService.error('Error when loading items menu');
      }
    })
  }

  updateActiveFilters(): void {
    const f = this.menuService.itemMenuFilter;
    const filters: { key: keyof MenuItemFilter; label: string; value: string }[] = [];

    if (f.itemType && f.itemType.length > 0) {
      const labels = this.itemTypeOptions
        .filter(opt => f.itemType!.includes(opt.value))
        .map(opt => opt.label);
      filters.push({
        key: 'itemType',
        label: 'Type',
        value: labels.join(', ')
      });
    }

    // Item Name
    if (f.itemName) {
      filters.push({
        key: 'itemName',
        label: 'Nom',
        value: f.itemName
      });
    }

    // Canteen
    if (f.canteenName) {
      const canteen = this.canteenParams.find(c => c.id === f.canteenName);
      filters.push({
        key: 'canteenName',
        label: 'Canteen',
        value: canteen?.name || f.canteenName
      });
    }

    this.activeFilters = filters;
  }

  removeFilter(key: keyof MenuItemFilter): void {
    (this.menuService.itemMenuFilter as any)[key] = key.endsWith('s') ? [] : undefined;
    this.loadItemMenu();
  }


  resetFilters(): void {
    this.menuService.itemMenuFilter = {
      itemType: [] ,
      itemName : '',
      canteenName : '',
    };
    this.activeFilters = [];
  }



}
