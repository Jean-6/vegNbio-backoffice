import {Component, OnInit} from '@angular/core';
import {AdminAsideMenu} from '../../../../_core/layout/admin-aside-menu/admin-aside-menu';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {AutoComplete, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors, ValidatorFn,
  Validators
} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {CommonModule} from '@angular/common';
import {Button} from 'primeng/button';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {InputText} from 'primeng/inputtext';
import {EventService} from '../../../../_core/services/event-service';
import {CanteenService} from '../../../../_core/services/canteen-service';
import {AlertService} from '../../../../_core/services/alert-service';
import {CanteenOption} from '../event-list-component/event-list-component';
import {Textarea} from 'primeng/textarea';
import {map} from 'rxjs';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {Canteen, DayOfWeek, OpeningHours} from '../../../../_core/models/canteen';
import {FileSelectEvent, FileUpload} from 'primeng/fileupload';
import {AnimateOnScroll} from 'primeng/animateonscroll';
import {GalleriaModule} from 'primeng/galleria';
import {Loader} from '../../../../_core/layout/loader/loader';
import {AddEvent} from '../../../../_core/dto/addEvent';
import {AuthService} from '../../../../_core/services/auth-service';
import {RouterLink} from '@angular/router';
import {AutoFocus} from 'primeng/autofocus';
import {ParamService} from '../../../../_core/services/param-service';
import {SelectItem} from '../../../../_core/dto/selectItem';


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
    Textarea,
    DatePicker,
    FileUpload,
    AnimateOnScroll,
    AutoComplete,
    GalleriaModule,
    Loader,
    RouterLink,
    AutoFocus,
  ],
  templateUrl: './add-event-component.html',
  standalone: true,
  styleUrl: './add-event-component.css'
})
export class AddEventComponent implements OnInit{

  infoForm!: FormGroup;
  dateForm!: FormGroup;
  locationForm!: FormGroup;
  mediaForm!: FormGroup;
  activeStep: number = 1;
  canteenParams: CanteenOption[] = [];
  filteredCanteens: CanteenOption[] = [];
  eventTypeParams: SelectItem[] = [];
  filteredEventType: SelectItem[] = [];
  _activeIndex: number = 0;
  selectedCanteen!: Canteen;
  images: { itemImageSrc: string; thumbnailImageSrc: string; alt: string; title: string }[] = [];
  loading: boolean = false;
  minDate: Date = new Date();
  selectedFiles: File[] = [];


  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }

    ];

  constructor(protected eventService: EventService,
              protected canteenService: CanteenService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private paramService: ParamService) {
    this.initForms();
  }

  ngOnInit(): void {

    this.loadEventTypes()
    this.loadCanteenOptions();

  }

  private loadEventTypes(): void {
    this.paramService.getEventTypes().subscribe({
      next:(options:SelectItem[]) => {
        this.eventTypeParams = options;
        this.filteredEventType=[...options]
      },
      error:(err) =>{
        console.error('Error loading event param:', err);
        this.alertService.error(`Error loading event param: ${err}`);
      }
    })

  }

  private initForms(){

    this.infoForm = this.formBuilder.group({
      type: new FormControl('',Validators.required),
      title: new FormControl('',Validators.required),
      desc: new FormControl('',Validators.required),
    })

    this.dateForm = this.formBuilder.group({
      date: ['',[Validators.required, this.futureDateValidator]],
      startTime: ['',Validators.required],
      endTime: ['', Validators.required],
    },
      { validators: this.timeRangeValidator}
    );

    this.locationForm = this.formBuilder.group({
      location: new FormControl('',Validators.required),
    })

    this.mediaForm = this.formBuilder.group({
      pictures: this.formBuilder.control<File[] | null> (null),
    },
      { validators: this.pictureRequiredValidator }
    );

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
        this.filteredCanteens = [...canteenSelectList];
        console.log('Canteen options:', canteenSelectList);
      },
      error: err => {
        console.error('Error loading canteen param:', err);
        this.alertService.error(`Error loading canteen like parameter : ${err}`)
      }
    });
  }

  nextStep(form: FormGroup | number, activateCallback: any, nextStepNumber: number) {

    if (form instanceof FormGroup) {
      form.markAllAsTouched();

      if (form.invalid) {
        if (form.hasError('invalidTimeRange')) {
          this.alertService.warn('L’heure de début doit être inférieure à l’heure de fin.');
        } else if (form.get('date')?.hasError('pastDate')) {
          this.alertService.warn('La date sélectionnée ne peut pas être antérieure à aujourd’hui.');
        } else {
          this.alertService.warn('Veuillez corriger les champs obligatoires.');
        }
        return;
      }

    }

    activateCallback(nextStepNumber);
  }

  prevStep(prevStepNumber: number, activateCallback: any) {
    activateCallback(prevStepNumber);
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredCanteens = this.canteenParams.filter(c =>
      c.name.toLowerCase().includes(query)
    );
  }

  search_({query}: { query: string }) {
    this.filteredEventType = this.eventTypeParams.filter(opt =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    );
  }

  /** Upload pictures  **/

  onSelect(selectEvent: FileSelectEvent) {
    if (selectEvent.files && selectEvent?.files?.length>0) {
      this.selectedFiles.push(...selectEvent.files);
      this.mediaForm.patchValue({pictures: this.selectedFiles});
      this.mediaForm.updateValueAndValidity();
    }
  }

  onUpload(event: { files: File[]}) {
    if(!this.selectedFiles.length){
      this.alertService.warn('Nothing images selected to upload');
      return;
    }
  }

  pictureRequiredValidator(group: AbstractControl) {
    const pictures = group.get('pictures')?.value;
    if (!pictures || pictures.length === 0) {
      return { noPictures: true };
    }
    return null;
  }

  onClear() {
    this.selectedFiles = [];
    this.mediaForm.patchValue({ pictures: [] });
    this.mediaForm.updateValueAndValidity();
  }

  /* Date and Hours*/

  futureDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore les heures

    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }


  private parseTimeToDate(value: any): Date | null {
    if (!value) return null;

    // si c'est déjà une Date
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    }

    // si c'est une string "HH:mm" ou "HH:mm:ss"
    if (typeof value === 'string') {
      const hhmm = value.split(':');
      if (hhmm.length >= 2) {
        const d = new Date(1970, 0, 1, Number(hhmm[0]), Number(hhmm[1]), hhmm[2] ? Number(hhmm[2]) : 0);
        return isNaN(d.getTime()) ? null : d;
      }
    }

    // parfois PrimeNG fournit un objet Date mais à minuit + time -> on gère ci-dessous également
    return null;
  }

  timeRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const startVal = group.get('startTime')?.value;
    const endVal = group.get('endTime')?.value;

    const startDate = this.parseTimeToDate(startVal);
    const endDate = this.parseTimeToDate(endVal);

    if (!startDate || !endDate) return null; // l'un ou l'autre non renseigné -> let required validators handle it

    // compare
    if (startDate >= endDate) {
      return { invalidTimeRange: true };
    }
    return null;
  };

  get date() { return this.dateForm.get('date'); }
  get startTime() { return this.dateForm.get('startTime'); }
  get endTime() { return this.dateForm.get('endTime'); }

  /**/

  onCanteenSelect(event: AutoCompleteSelectEvent) {
    this.loading = true;
    const canteenId = event.value.id;

    this.canteenService.getCanteenById(canteenId)
      .subscribe({
        next: (canteen:ResponseWrapper<Canteen>)=>{
          this.selectedCanteen = canteen.data

          //Load images into PrimeNG galeria
          this.images = this.selectedCanteen.pictures.map((url: string) => ({
            itemImageSrc: url,
            thumbnailImageSrc: url,
            alt: this.selectedCanteen.name || 'photo',
            title: this.selectedCanteen.name
          }));

          if(this.images.length > 0){
            this.activeIndex = 0;
          }

          this.locationForm.patchValue({
            location: canteen.data.id
          });
          this.loading = false;
        },
        error: err => {
          console.error(`Error loading canteen selected: ${err}`)
          this.alertService.error(`Error loading canteen selected: ${err}`)
        },
        complete(){

        }
      })

  }

  /**/
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
    if (this.images && this.images.length > 0 && 0 <= newValue && newValue <= this.images.length - 1) {
      this._activeIndex = newValue;
    }
  }


  getDayLabel(day: DayOfWeek): string {
    switch(day) {
      case DayOfWeek.Monday: return 'Lundi';
      case DayOfWeek.Tuesday: return 'Mardi';
      case DayOfWeek.Wednesday: return 'Mercredi';
      case DayOfWeek.Thursday: return 'Jeudi';
      case DayOfWeek.Friday: return 'Vendredi';
      case DayOfWeek.Saturday: return 'Samedi';
      case DayOfWeek.Sunday: return 'Dimanche';
      default: return '';
    }
  }
  /*getOpeningHours(day: DayOfWeek): OpeningHours {
    return this.selectedCanteen?.openingHoursMap.get(day) || { open: null, close: null };
  }*/

  /*formatTime(time: string | null): string {
    return time ? time.substring(0, 5) : 'Fermé';
  }*/

  /*getDaysOfWeek(): DayOfWeek[] {
    return [
      DayOfWeek.Monday,
      DayOfWeek.Tuesday,
      DayOfWeek.Wednesday,
      DayOfWeek.Thursday,
      DayOfWeek.Friday,
      DayOfWeek.Saturday,
      DayOfWeek.Sunday,
    ];
  }*/


  // Final submission

  onSubmit() {

    this.mediaForm.markAllAsTouched();
    if (this.mediaForm.invalid) {
      if (this.mediaForm.hasError('noPictures')) {
        this.alertService.warn('Veuillez uploader au moins une image.');
      }
      return;
    }

    this.loading = true;

    const formatTime = (date: Date | string): string => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().substring(11, 16); // extrait HH:mm
    };

    const formatDate = (date: Date | string): string => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // extrait "yyyy-MM-dd"
    };

    const eventData: AddEvent = {
      canteenId: this.selectedCanteen.id,
      title: this.infoForm.get('title')?.value,
      desc: this.infoForm.get('desc')?.value,
      type: this.infoForm.get('type')?.value,
      startTime: formatTime(this.dateForm.get('startTime')?.value),
      endTime: formatTime(this.dateForm.get('endTime')?.value),
      date: formatDate(this.dateForm.get('date')?.value),
      userId: this.authService.getUserId()?.toString()
    }

    let files = this.mediaForm.get('pictures')?.value ;

    if(!files){
      files = [];
    }else if(files instanceof FileList){
      files = Array.from(files);
    }else if(!Array.isArray(files)){
      files = [files];
    }

    this.eventService.saveEventWithPictures(eventData, files).subscribe({
      next: (res) => {
        console.log('Event saved with success :', res.data);
        this.alertService.success('Événement enregistré avec succès !');
        this.loading = false;

        this.activeStep = 5;
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement :', err);
        this.alertService.error('Erreur lors de l’enregistrement de l’événement.');
        this.loading = false;
      }
    });
  }

  resetForms() {
    this.infoForm.reset();
    this.dateForm.reset();
    this.locationForm.reset();
    this.mediaForm.reset();
    this.selectedFiles = [];
    this.selectedCanteen = undefined!;
    this.images = [];
    this.activeStep = 1;
  }


}
