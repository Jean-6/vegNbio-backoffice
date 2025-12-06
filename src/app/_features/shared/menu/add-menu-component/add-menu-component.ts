import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {Button} from 'primeng/button';
import {FileSelectEvent, FileUpload, FileUploadEvent} from 'primeng/fileupload';
import {AutoFocus} from 'primeng/autofocus';
import {Textarea} from 'primeng/textarea';
import {Select} from 'primeng/select';
import {InputText} from 'primeng/inputtext';
import {AlertService} from '../../../../_core/services/alert-service';
import {AuthService} from '../../../../_core/services/auth-service';
import {ParamService, SelectCanteen} from '../../../../_core/services/param-service';
import {SelectItem} from '../../../../_core/dto/selectItem';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {KeyFilter} from 'primeng/keyfilter';
import {PickList} from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import {PrimeTemplate} from 'primeng/api';
import {Checkbox} from 'primeng/checkbox';
import {Loader} from '../../../../_core/layout/loader/loader';
import {MenuService} from '../../../../_core/services/menu-service';
import {RouterLink} from '@angular/router';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';
import {animate, style, transition, trigger} from '@angular/animations';
import {AddMenuItem} from '../../../../_core/dto/menuItem';


export const drinkVolumes: SelectItem[] = [
  { label: "25 cl", value: "250ml" },
  { label: "33 cl", value: "330ml" },
  { label: "50 cl", value: "500ml" },
  { label: "75 cl", value: "750ml" },
];

@Component({
  selector: 'app-add-menu-component',
  imports: [
    CommonModule,
    Step,
    NavbarTop,
    Stepper,
    StepList,
    StepPanels,
    ReactiveFormsModule,
    StepPanel,
    Button,
    AutoFocus,
    Textarea,
    Select,
    InputText,
    KeyFilter,
    PickList,
    PrimeTemplate,
    Checkbox,
    FileUpload,
    Loader,
    RouterLink,
    AsideMenuComponent,
  ],
  templateUrl: './add-menu-component.html',
  standalone: true,
  styleUrl: './add-menu-component.css',
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
export class AddMenuComponent implements  OnInit{

  infoForm!: FormGroup;
  mealForm!: FormGroup;
  drinkForm!: FormGroup;
  loading: any;
  mediaForm!: FormGroup;
  activeStep: number = 1;
  menuItemTypes: SelectItem[]=[];
  canteenParams: SelectCanteen[] = [];
  filteredCanteen: SelectCanteen[]= [];

  foodTypeParams: SelectItem[] = [];
  filteredFoodType: SelectItem[]= [];

  sourceIngredients: SelectItem[] = [];
  targetIngredients: SelectItem[] = [];
  sourceAllergens: SelectItem[] = [];
  targetAllergens: SelectItem[] = [];

  drinkVolumes = drinkVolumes;



  private initForms() {
    this.infoForm = this.formBuilder.group({
      itemType: new FormControl('', Validators.required),
      canteen: ['', Validators.required],
      name: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),

    });

    this.drinkForm = this.formBuilder.group({
      volume:  ['', Validators.required],
      isGaseous: [false],
      isAlcoholic: [false],
    });

    this.mediaForm = this.formBuilder.group({
      pictures: this.formBuilder.control<File[] | null> (null),
    })

  }

  // ----- InfoForm Getters -----
  get itemType() {
    return this.infoForm.get('itemType');
  }

  get canteen() {
    return this.infoForm.get('canteen');
  }

  get name() {
    return this.infoForm.get('name');
  }

  get desc() {
    return this.infoForm.get('desc');
  }

  get price() {
    return this.infoForm.get('price');
  }

// ----- DrinkForm Getters -----
  get volume() {
    return this.drinkForm.get('volume');
  }

  get isGaseous() {
    return this.drinkForm.get('isGaseous');
  }

  get isAlcoholic() {
    return this.drinkForm.get('isAlcoholic');
  }

// ----- MediaForm Getters -----
  get pictures() {
    return this.mediaForm.get('pictures');
  }


  get selectedType(): string | null {
    const v = this.infoForm.get('itemType')?.value;
    if (!v) return null;
    if (typeof v === 'string') return v;
    if (v.value) return v.value;
    if (v.label && v.label.toLowerCase) return v.label.toString().toLowerCase();
    return null;
  }



  constructor(protected menuService: MenuService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private paramService: ParamService) {

    this.initForms();
  }

  ngOnInit(): void {

    this.loadMenuItemType()
    this.loadOwnCanteensParams()
    this.loadMenuIngredients()
    this.loadMenuAllergens()
    this.loadFoodType()
  }


  loadMenuItemType():void{
    this.loading = true;
    this.paramService.getMenuItemType().subscribe({
      next:(type)=> {
        this.menuItemTypes = type;
        this.loading = false
      },
      error:(err)=> {
        console.error('Error when loading menu item type', err)
        this.alertService.error('Error when loading menu type',err)
      }
    });
  }

  loadOwnCanteensParams(){
    this.loading = true;
    this.paramService.getOwnCanteensApproved()
      .subscribe({
        next: (options: ResponseWrapper<SelectCanteen[]>) => {
          this.canteenParams = options.data;
          this.filteredCanteen = [...options.data];
          this.loading = false;

          if (!this.filteredCanteen || this.filteredCanteen.length === 0) {
            this.alertService.warn("Aucun restaurant trouvé.");
          }
        },
        error: err => {
          console.error('Error loading service param:', err);
          this.alertService.error(`Error loading service param: ${err}`);
        }
      })
  }

  loadMenuIngredients(){
    this.loading = true;
    this.paramService.getIngredientsOfMenu()
      .subscribe({
        next: (options: SelectItem[]) => {
          this.sourceIngredients = options.map(opt=> ({
            label: opt.label,
            value: opt.value,
            icon: opt.icon,
          }));
          console.log(this.sourceIngredients)
          this.cdr.markForCheck();
          this.loading = false;

        },
        error: err => {
          console.error('Error loading ingredient list:', err);
          this.alertService.error(`Error loading ingredient list: ${err}`);
        }
      })
  }


  loadMenuAllergens(){
    this.loading = true;
    this.paramService.getAllergens()
      .subscribe({
        next: (options: SelectItem[]) => {
          this.sourceAllergens = options.map(opt=> ({
            label: opt.label,
            value: opt.value,
            //icon: opt.icon,
          }));
          this.cdr.markForCheck();
          this.loading = false;

        },
        error: err => {
          console.error('Error loading ingredient list:', err);
          this.alertService.error(`Error loading ingredient list: ${err}`);
        }
      })
  }

  loadFoodType(){
    this.loading = true;
    this.paramService.getFoodTypes()
      .subscribe({
        next: (options: SelectItem[]) => {
          this.foodTypeParams = options;
          this.filteredFoodType = [...options];
          this.loading = false;

        },
        error: err => {
          console.error('Error loading food type list:', err);
          this.alertService.error(`Error loading food type list: ${err}`);
        }
      })
  }

  searchFoodType(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredFoodType = this.foodTypeParams
      .filter(c => c.label.toLowerCase().includes(query))
      .filter((c, i, arr) => arr.findIndex(x => x.label === c.label) === i);
  }


  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredCanteen = this.canteenParams
      .filter(c => c.name.toLowerCase().includes(query))
      .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
  }




  nextStep(formOrStep: FormGroup | number, activateCallback: any, nextStepNumber: number) {


    if (formOrStep instanceof FormGroup) {
      formOrStep.markAllAsTouched();
      if (formOrStep.invalid) {
        this.alertService.warn('Veuillez remplir tous les champs obligatoires.');
        return;
      }
    }

    if (nextStepNumber === 3) {
      console.log(this.itemType?.value?.value)
      const typesAvecIngredients = ['appetizer', 'meal', 'dessert'];
      if (typesAvecIngredients.includes(this.itemType?.value?.value)) {
        if (!this.targetIngredients || this.targetIngredients.length === 0) {
          this.alertService.warn('Veuillez sélectionner au moins un ingrédient.');
          return; // On bloque seulement si on est à l’étape 2
        }
      }
    }

    activateCallback(nextStepNumber);

  }

  prevStep(prevStepNumber: number, activateCallback: any) {
    activateCallback(prevStepNumber);
  }



  /* Pictures */
  selectedFiles: File[] = [];
  onSelect(selectEvent: FileSelectEvent) {
    if (selectEvent.files && selectEvent?.files?.length>0) {
      this.selectedFiles.push(...selectEvent.files);
      this.mediaForm.patchValue({pictures: this.selectedFiles});
    }

  }

  onUpload(event: FileUploadEvent) {
    if(!this.selectedFiles.length){
      this.alertService.warn('Nothing images selected to upload');
      return;
    }
  }



  onSubmit() {

    const addMenuItemData: AddMenuItem = {

      itemType: this.itemType?.value?.value,
      canteenId: this.canteen?.value?.id ?? '',
      itemName:  this.name?.value ?? '',
      desc: this.desc?.value,
      price: this.price?.value,
      userId: this.authService.getUserId(),


      // Champs spécifiques aux drinks
      volume: this.selectedType === 'drink' ? this.drinkForm.get('volume')?.value  : null,
      isGaseous: this.selectedType === 'drink' ? this.drinkForm.get('isGaseous')?.value : false,
      isAlcoholic: this.selectedType === 'drink' ? this.drinkForm.get('isAlcoholic')?.value : false,

      // Champs spécifiques aux meals
      ingredients: this.selectedType === 'meal' ?
        this.targetIngredients.map(item => item.value) : [],
      allergens: this.selectedType === 'meal' ?
        this.targetAllergens.map(item => item.value) : [],
    }

    const files = this.mediaForm.get('pictures')?.value || [];

    this.loading = true;
    this.menuService.saveItemMenuWithPictures(addMenuItemData, files).subscribe({
      next: (res) => {
        this.alertService.success('Menu saved with success !');
        this.loading = false;
        this.activeStep = 4;
      },
      error: (err) => {
        console.error('Error when saving menu :', err);
        this.alertService.error('Error when saving menu:', err);
        this.loading = false;
      }
    });
  }

  resetForms() {
    this.loading = true;
    this.infoForm.reset();
    this.mealForm.reset();
    this.drinkForm.reset();
    this.mediaForm.reset();
    this.selectedFiles = [];
    this.loading = false;
  }



}
