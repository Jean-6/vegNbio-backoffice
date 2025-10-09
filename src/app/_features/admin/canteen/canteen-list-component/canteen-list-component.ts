import {Component, OnInit} from '@angular/core';
import {AdminAsideMenu} from '../../../../_core/layout/admin-aside-menu/admin-aside-menu';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {CanteenService} from '../../../../_core/services/canteen-service';
import {CommonModule} from '@angular/common';
import {CanteenOption, EventOption, StatusOption} from '../../event/event-list-component/event-list-component';
import {Canteen} from '../../../../_core/models/canteen';
import {AlertService} from '../../../../_core/services/alert-service';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {TableModule} from 'primeng/table';
import {MultiSelect} from 'primeng/multiselect';
import {InputNumber} from 'primeng/inputnumber';
import {Loader} from '../../../../_core/layout/loader/loader';
import {Button} from 'primeng/button';


export interface ServiceOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-canteen-list-component',
  imports: [
    CommonModule,
    AdminAsideMenu,
    DatePicker,
    FormsModule,
    InputText,
    MultiSelect,
    NavbarTop,
    TableModule,
    InputNumber,
    Loader,
    Button,
  ],
  templateUrl: './canteen-list-component.html',
  standalone: true,
  styleUrl: './canteen-list-component.css'
})
export class CanteenListComponent implements OnInit{

  statuses: any[] | undefined;
  canteenParams: CanteenOption[] = [];
  eventParams: EventOption[] = [];
  statusParams: StatusOption[] = [];
  serviceParams: ServiceOption[] = [];
  canteens: Canteen[] = [];
  items: string[] =[];
  selectedCanteen: Canteen | null = null;
  visible: boolean =  false ;
  isLoading= false;

  constructor(protected canteenService: CanteenService,
              protected alertService: AlertService) {
  }

  ngOnInit(): void {

    this.loadCanteenService()
    this.loadCanteenStatus()
    this.loadCanteens()
  }

  loadCanteens() {
    this.isLoading = true;
    this.canteenService.loadCanteens()
      .subscribe({
        next: (res: ResponseWrapper<Canteen[]>) => {
          this.canteens = res.data;
          console.log("canteen : "+this.canteens)
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(`Error http when fetching canteens : ${err}`);
        }
      });
  }


  loadCanteenStatus(){
    this.canteenService.getCanteenStatus()
      .subscribe({
        next: options => {
          this.statusParams = options;
        },
        error: err => {
          console.error('Error loading canteen param:', err);
          this.alertService.error(`Error loading canteen param: ${err}`);
        }
      })
  }

  loadCanteenService(){
    this.canteenService.getCanteenService()
      .subscribe({
        next: options => {
          this.serviceParams = options;
        },
        error: err => {
          console.error('Error loading service param:', err);
          this.alertService.error(`Error loading service param: ${err}`);
        }
      })
  }


  showDialog(canteen: Canteen) {

  }
}
