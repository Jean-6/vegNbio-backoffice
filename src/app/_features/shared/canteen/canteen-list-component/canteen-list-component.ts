import {Component, OnInit} from '@angular/core';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {CanteenService} from '../../../../_core/services/canteen-service';
import {CommonModule} from '@angular/common';
import {Canteen, DayOfWeek, OpeningHours, Status} from '../../../../_core/dto/canteen';
import {AlertService} from '../../../../_core/services/alert-service';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {TableModule} from 'primeng/table';
import {MultiSelect} from 'primeng/multiselect';
import {InputNumber} from 'primeng/inputnumber';
import {Loader} from '../../../../_core/layout/loader/loader';
import {Button} from 'primeng/button';
import {SelectItem} from '../../../../_core/dto/selectItem';
import {ParamService, SelectCanteen} from '../../../../_core/services/param-service';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {AutoFocus} from 'primeng/autofocus';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';
import {Dialog} from 'primeng/dialog';
import {Image} from 'primeng/image';
import {AuthService} from '../../../../_core/services/auth-service';


@Component({
  selector: 'app-canteen-list-component',
  imports: [
    CommonModule,
    DatePicker,
    FormsModule,
    InputText,
    MultiSelect,
    NavbarTop,
    TableModule,
    InputNumber,
    Loader,
    AutoComplete,
    AutoFocus,
    AsideMenuComponent,
    Dialog,
    Image,
    Button,
  ],
  templateUrl: './canteen-list-component.html',
  standalone: true,
  styleUrl: './canteen-list-component.css'
})
export class CanteenListComponent implements OnInit{

  canteenParams: SelectCanteen[] = [];
  filteredCanteen: SelectCanteen[] = [];
  eventParams: SelectItem[] = [];
  statusParams: SelectItem[] = [];
  serviceParams: SelectItem[] = [];
  canteens: Canteen[] = [];
  items: string[] =[];
  selectedCanteen: Canteen | null = null;
  visible: boolean =  false ;
  isLoading= false;

  daysOfWeek = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
  dayMap: Record<string, DayOfWeek> = {
    'Lundi': DayOfWeek.MONDAY,
    'Mardi': DayOfWeek.TUESDAY,
    'Mercredi': DayOfWeek.WEDNESDAY,
    'Jeudi': DayOfWeek.THURSDAY,
    'Vendredi': DayOfWeek.FRIDAY,
    'Samedi': DayOfWeek.SATURDAY,
    'Dimanche': DayOfWeek.SUNDAY,
  };

  getOpeningHours(day: string): OpeningHours | undefined {
    if (!this.selectedCanteen || !this.selectedCanteen.openingHoursMap) return undefined;

    const dayEnum = this.dayMap[day]; // ex: "MONDAY"
    return this.selectedCanteen.openingHoursMap[dayEnum];
  }


  constructor(protected canteenService: CanteenService,
              protected alertService: AlertService,
              protected  paramService: ParamService,
              protected authService: AuthService) {
  }

  ngOnInit(): void {

    this.loadCanteenParams()
    this.loadCanteenService()
    this.loadCanteenStatus()
    this.loadCanteens()
  }

  loadCanteens() {
    this.isLoading = true;
    this.canteenService.loadCanteens(this.canteenService.canteenFilter)
      .subscribe({
        next: (res: ResponseWrapper<Canteen[]>) => {
          this.canteens = res.data;
          this.isLoading = false;
          console.log(res.data);
        },
        error: (err: any) => {
          console.log(`Error http when fetching canteens : ${err}`);
        }
      });
  }


  loadCanteenStatus(){
    this.paramService.getApprovalStatuses()
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
    this.paramService.getServiceTypes()
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



  search(event: AutoCompleteCompleteEvent) {
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


  showDialog(canteen: Canteen) {
    this.isLoading = true;
    if(!canteen) return
    this.selectedCanteen = canteen;
    this.visible = true;
    this.isLoading = false;
  }


  submitApproval(selectedCanteen: Canteen | null) {
    this.isLoading = true;
    if(!selectedCanteen) return;
    this.canteenService
      .approveOrReject(selectedCanteen.id, {status: Status.APPROVED})
      .subscribe({
        next:() =>{
          this.isLoading =false
          this.closeDialog()
          this.alertService.success("Restaurant approuvé")
          this.ngOnInit()

        },
        error:(err)=>{
          console.error('Error when approving canteen:', err);
          this.alertService.error(`Error when approving canteen: ${err}`);
        }
      })
  }

  submitReject(selectedCanteen: Canteen | null){
    this.isLoading = true;
    if(!selectedCanteen) return;
    this.canteenService
      .approveOrReject(selectedCanteen.id, {status: Status.REJECTED} )
      .subscribe({
        next:() =>{
          this.isLoading =false;
          this.closeDialog()
          this.alertService.success("Approbation refusée");
          this.ngOnInit()
        },
        error: (err)=>{
          console.error('Error when rejecting canteen:', err);
          this.alertService.error(`Error when rejecting canteen: ${err}`);
        }
      })
  }

  deleteCanteen(selectedCanteen: Canteen | null) {
    this.isLoading = true;
    if(!selectedCanteen) return;
    this.canteenService
      .delete(selectedCanteen.id )
      .subscribe({
        next:() =>{
          this.isLoading =false;
          this.closeDialog()
          this.alertService.success("Restaurant supprimée avec succes");
          this.ngOnInit()
        },
        error: (err)=>{
          console.error('Error when deleting canteen:', err);
          this.alertService.error(`Error when deleting canteen: ${err}`);
        }
      })

  }

  closeDialog() {
    this.visible = false;
    this.selectedCanteen = null;
  }

  protected readonly Status = Status;
}
