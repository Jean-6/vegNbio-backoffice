import {Component, OnInit} from '@angular/core';
import {AdminAsideMenu} from '../../../../_core/layout/admin-aside-menu/admin-aside-menu';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {AutoComplete} from 'primeng/autocomplete';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {MultiSelect} from 'primeng/multiselect';
import {CommonModule} from '@angular/common';
import {Button} from 'primeng/button';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {InputText} from 'primeng/inputtext';
import {EventService} from '../../../../_core/services/event-service';
import {CanteenService} from '../../../../_core/services/canteen-service';
import {AlertService} from '../../../../_core/services/alert-service';
import {CanteenOption, EventOption} from '../event-list-component/event-list-component';
import {Textarea} from 'primeng/textarea';
import {map} from 'rxjs';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {Canteen} from '../../../../_core/models/canteen';
import {FileSelectEvent, FileUpload} from 'primeng/fileupload';
import {AnimateOnScroll} from 'primeng/animateonscroll';


interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-add-event-component',
  imports: [
    AdminAsideMenu,
    NavbarTop,
    FormsModule,
    ReactiveFormsModule,
    Button,
    StepPanel,
    Step,
    Stepper,
    StepList,
    StepPanels,
    InputText,
    CommonModule,
    MultiSelect,
    Textarea,
    DatePicker,
    FileUpload,
    AnimateOnScroll,
    AutoComplete
  ],
  templateUrl: './add-event-component.html',
  standalone: true,
  styleUrl: './add-event-component.css'
})
export class AddEventComponent implements OnInit{

  organizers: any;
  eventForm!: FormGroup;
  eventTypes: any[] | undefined;
  eventParams: EventOption[] = [];
  infoForm!: FormGroup;
  dateForm!: FormGroup;
  locationForm!: FormGroup;
  mediaForm!: FormGroup;
  activeStep: number = 1;
  canteenParams: CanteenOption[] = [];

  eventData: any = {};


  constructor(protected eventService: EventService,
              protected canteenService: CanteenService,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {

    this.loadCanteenOptions();
    this.loadEventOptions();
  }

  private initForms(){

    this.infoForm = this.formBuilder.group({
      type: new FormControl('',Validators.required),
      title: new FormControl('',Validators.required),
      desc: new FormControl('',Validators.required),
    })

    this.dateForm = this.formBuilder.group({
      startTime: new FormControl('',Validators.required),
      endTime: new FormControl('',Validators.required),
      date: new FormControl('',Validators.required),
    })

    this.locationForm = this.formBuilder.group({
      location: new FormControl('',Validators.required),
    })

    this.mediaForm = this.formBuilder.group({
      pictures: this.formBuilder.control<File[] | null> (null),
    })

  }

  searchOrganizer($event: any) {

  }

  onCancel() {

  }

  name : any;
  email: any;
  password: any;


  loadEventOptions(){
    this.eventService.getEventOptions()
      .subscribe({
        next: options => {
          this.eventParams = options;
        },
        error: err => {
          console.error('Error loading event param:', err);
          this.alertService.error(`Error loading event param: ${err}`);
        }
      })
  }

  loadCanteenOptions() {
    this.canteenService.getCanteenSelected().pipe(
      map((res: ResponseWrapper<Canteen[]>) => {
        const seenNames = new Set<string>();
        return res.data
          .map(c => ({ id: c.id, name: c.name } as CanteenOption))
          .filter(c => {
            if (seenNames.has(c.name)) return false;
            seenNames.add(c.name);
            return true;
          });
      })
    ).subscribe({
      next: (canteenSelectList: CanteenOption[]) => {
        this.canteenParams = canteenSelectList;
        console.log('Canteen options:', canteenSelectList);
      },
      error: err => {
        console.error('Error loading canteen param:', err);
      }
    });
  }

  onUpload(event: { files: File[]}) {
    if (event?.files?.length) {
      this.mediaForm.get('pictures')?.setValue(event.files);
    }
  }

  onSelect(event: FileSelectEvent) {

  }


  // Navigation between step with validations
  private nextStep(step: number){
    if(this.isStepValid(this.activeStep)){
      this.activeStep = step;
    }
  }

  private prevStep(step: number){
    this.activeStep = step;
  }

  private isStepValid(step: number): boolean{
    switch(step){
      case 1:
        return this.infoForm.valid;
      case 2:
        return this.dateForm.valid;
      case 3:
        return this.locationForm.valid;
      case 4:
        return this.mediaForm.valid;
      default:
        return true;
    }
  }
  // Final submission
  onSubmit() {
    if(this.infoForm.valid && this.dateForm.valid && this.locationForm) {
      this.eventData = {
        ...this.infoForm.value,
        ...this.dateForm.value,
        ...this.locationForm.value,
        ...this.mediaForm.value
      };
      console.log();
      this.alertService.error('');
    }else {
      console.log();
      this.alertService.success('');
    }
  }

  search($event: AutoCompleteCompleteEvent) {

  }
}
