import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {GalleriaModule} from 'primeng/galleria';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {CanteenService} from '../../../../_core/services/canteen-service';
import {AlertService} from '../../../../_core/services/alert-service';
import {AuthService} from '../../../../_core/services/auth-service';
import {AddCanteen, Canteen, DayOfWeek} from '../../../../_core/dto/canteen';
import {TableModule} from 'primeng/table';
import {DatePicker} from 'primeng/datepicker';
import {PickList, PickListModule} from 'primeng/picklist';
import {SelectItem} from '../../../../_core/dto/selectItem';
import {ParamService} from '../../../../_core/services/param-service';
import {FileSelectEvent, FileUpload} from 'primeng/fileupload';
import {Loader} from '../../../../_core/layout/loader/loader';
import {RouterLink} from '@angular/router';
import {Location} from '../../../../_core/dto/location';
import {Select} from 'primeng/select';
import {AutoFocus} from 'primeng/autofocus';
import {CommonModule} from '@angular/common';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';
import {animate, style, transition, trigger} from '@angular/animations';
import {KeyFilter} from 'primeng/keyfilter';



export const dayDisplayMap: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Lundi',
  [DayOfWeek.TUESDAY]: 'Mardi',
  [DayOfWeek.WEDNESDAY]: 'Mercredi',
  [DayOfWeek.THURSDAY]: 'Jeudi',
  [DayOfWeek.FRIDAY]: 'Vendredi',
  [DayOfWeek.SATURDAY]: 'Samedi',
  [DayOfWeek.SUNDAY]: 'Dimanche'
};

const dayMap: Record<string, DayOfWeek> = {
  'Lundi': DayOfWeek.MONDAY,
  'Mardi': DayOfWeek.TUESDAY,
  'Mercredi': DayOfWeek.WEDNESDAY,
  'Jeudi': DayOfWeek.THURSDAY,
  'Vendredi': DayOfWeek.FRIDAY,
  'Samedi': DayOfWeek.SATURDAY,
  'Dimanche': DayOfWeek.SUNDAY,
};


@Component({
  selector: 'app-add-canteen-component',
  imports: [
    CommonModule,
    NavbarTop,
    StepList,
    Stepper,
    Step,
    ReactiveFormsModule,
    GalleriaModule,
    StepPanel,
    StepPanels,
    Button,
    InputText,
    Textarea,
    TableModule,
    DatePicker,
    PickListModule,
    FileUpload,
    Loader,
    RouterLink,
    Select,
    AutoFocus,
    AsideMenuComponent,
    KeyFilter,
  ],
  templateUrl: './add-canteen-component.html',
  standalone: true,
  styleUrl: './add-canteen-component.css',
  animations:[
    trigger('fadeAnimation',[
      transition(':enter',[
        style({opacity:0}),
        animate('300ms ease-out', style({opacity: 1}))
      ]),
      transition(':leave',[
        animate('300ms ease-in', style({opacity: 0 }))
      ])
    ])
  ]
})
export class AddCanteenComponent implements OnInit {

  infoForm!: FormGroup;
  hourlyForm!: FormGroup;
  servicesForm!: FormGroup;
  mediaForm!: FormGroup;
  activeStep: number = 1;
  selectedCanteen!: Canteen;
  images: { itemImageSrc: string; thumbnailImageSrc: string; alt: string; title: string }[] = [];
  loading: boolean = false;
  cities: SelectItem[] =[];

  sourceServices: SelectItem[] = [];
  targetServices: SelectItem[] = [];
  location!: Location ;


  daysOfWeek = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche'
  ];


  constructor(protected canteenService: CanteenService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private paramService: ParamService) {
    this.initForms();

  }

  ngOnInit(): void {

    this.hourlyForm = this.formBuilder.group({
      startTime: new FormControl('',Validators.required),
      endTime: new FormControl('',Validators.required),
      date: new FormControl('',Validators.required),
    })

    this.hourlyForm = this.formBuilder.group({
      days: this.formBuilder.array(
        this.daysOfWeek.map((day) =>
          this.formBuilder.group({
            day: [day],
            open: ['11:00'],
            close: ['22:00'],
            isClosed: [false],
          })
        )
      ),
    });


    this.loadServices();
    this.loadCities();
  }

  get daysArray(): FormArray {
    return this.hourlyForm.get('days') as FormArray;
  }

  private initForms(){

    this.infoForm = this.formBuilder.group({
      name: new FormControl('',Validators.required),
      email: new FormControl('',Validators.required),
      phone: new FormControl('',Validators.required),
      address: new FormControl('',Validators.required),
      city: new FormControl('',Validators.required),
      desc: new FormControl('',Validators.required),
    });

    this.servicesForm = this.formBuilder.group({
      selectedServices: [[],Validators.required],
      room: new FormControl('',Validators.required),
    })

    this.mediaForm = this.formBuilder.group({
      pictures: this.formBuilder.control<File[] | null> (null),
    })

  }

  nextStep(formOrStep: FormGroup | number, activateCallback: any, nextStepNumber: number) {

    // Cas formulaire : vérifie si valide
    if (formOrStep instanceof FormGroup) {
      formOrStep.markAllAsTouched();
      if (formOrStep.invalid) {
        this.alertService.warn('Veuillez remplir tous les champs obligatoires.');
        return;
      }
    }

    // Cas PickList étape 3
    if (nextStepNumber === 4) { // étape 3 → 4
      if (this.targetServices.length === 0) {
        this.alertService.warn('Veuillez sélectionner au moins un service.');
        return;
      }
    }

    activateCallback(nextStepNumber);
  }

  prevStep(prevStepNumber: number, activateCallback: any) {
    activateCallback(prevStepNumber);
  }

  loadServices():void{
    this.loading = true;
    this.paramService.getServiceTypes().subscribe({
        next:(services)=> {
          this.sourceServices = services
          this.cdr.markForCheck()

          this.loading = false
        },
        error:(err)=> {
          console.error('')
          this.alertService.error('')
        }
      });
  }

  loadCities():void{
    this.loading = true;
    this.paramService.getCities().subscribe({
      next:(cities)=> {
        this.cities = cities
        this.loading = false;
      },
      error:(err)=> {
        console.error('Error loading cities', err)
        this.alertService.error('Error loading cities',err)
      }
    });
  }


  /** Pictures  **/
  selectedFiles: File[] = [];
  onSelect(selectEvent: FileSelectEvent) {
    if (selectEvent.files && selectEvent?.files?.length>0) {
      this.selectedFiles.push(...selectEvent.files);
      this.mediaForm.patchValue({pictures: this.selectedFiles});
    }
  }

  onUpload(event: { files: File[]}) {
    if(!this.selectedFiles.length){
      this.alertService.warn('Nothing images selected to upload');
      return;
    }
  }

  // Final submission
  onSubmit() {
    const openingHoursMap: Record<string, any> = {};

    this.daysArray.value.forEach((dayGroup: any) => {
      if (!dayGroup.isClosed) {
        const enumDay = dayMap[dayGroup.day];
        if (enumDay) {

          openingHoursMap[enumDay] = {
            open: dayGroup.open,
            close: dayGroup.close,
          };
        }
      }
    });

    const canteenData: AddCanteen = {
      name: this.infoForm.get('name')?.value,
      desc: this.infoForm.get('desc')?.value,
      contact: {
        email: this.infoForm.get('email')?.value,
        phone: this.infoForm.get('phone')?.value,
      },
      equipments: this.targetServices.map(s => s.label),
      meetingRooms: this.servicesForm.get('room')?.value,
      openingHoursMap: openingHoursMap,
      location: {
        address: this.infoForm.value.address,
        city: this.infoForm.value.city,
        postalCode: '',
        country: ''
      },
      tags: [],
      userId: this.authService.getUserId()?.toString()
    };


    console.log("before ading : ",canteenData)

    const files = this.mediaForm.get('pictures')?.value || [];

    this.loading = true;
    this.canteenService.saveCanteenWithPictures(canteenData, files).subscribe({
      next: (res) => {
        this.alertService.success('canteen saved with success !');
        this.loading = false;
        this.resetForms();
        this.activeStep = 5;
      },
      error: (err) => {
        console.error('Error when canteen saving  :', err);
        this.alertService.error('Error when canteen saving ');
        this.loading = false;
      }
    });
  }

  resetForms() {
    this.infoForm.reset();
    this.mediaForm.reset();
    this.selectedFiles = [];
    this.selectedCanteen = undefined!;
    this.images = [];
    this.activeStep = 1;
  }

  getOpeningHours(day: string) {
    if (!this.selectedCanteen) return undefined;
    const enumDay = dayMap[day] as keyof typeof this.selectedCanteen.openingHoursMap;
    return this.selectedCanteen.openingHoursMap[enumDay];
  }

}
