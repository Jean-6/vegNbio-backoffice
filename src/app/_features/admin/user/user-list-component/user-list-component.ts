import {Component, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../../../_core/services/auth-service';
import {AlertService} from '../../../../_core/services/alert-service';
import {UserService} from '../../../../_core/services/user-service';
import {MultiSelect} from 'primeng/multiselect';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Loader} from '../../../../_core/layout/loader/loader';
import {TableModule} from 'primeng/table';
import {User, UserFilter} from '../../../../_core/dto/user';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {ERole} from '../../../../_core/dto/eRole';
import {Dialog} from 'primeng/dialog';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {Tooltip} from 'primeng/tooltip';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';
import {CommonModule} from '@angular/common';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {Status} from '../../../../_core/dto/canteen';
import {Card} from 'primeng/card';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {Panel} from 'primeng/panel';
import {Select} from 'primeng/select';
import {AutoComplete} from 'primeng/autocomplete';
import {Chip} from 'primeng/chip';



@Component({
  selector: 'app-user-list-component',
  imports: [
    CommonModule,
    MultiSelect,
    ReactiveFormsModule,
    FormsModule,
    Loader,
    TableModule,
    Tag,
    Button,
    Dialog,
    NavbarTop,
    Tooltip,
    AsideMenuComponent,
    Card,
    PdfViewerModule,
    //Panel,
    Select,
    AutoComplete,
    Chip,
  ],
  templateUrl: './user-list-component.html',
  standalone: true,
  styleUrl: './user-list-component.css'
})
export class UserListComponent implements OnInit{

  status = [
    { label: 'Vérifié', value: 'verified' },
    { label: 'Non-vérifié', value: 'unverified' },
  ];


  roles = [
    { label: 'Restaurateur', value: 'RESTORER' },
    { label: 'Client', value: 'CUSTOMER' },
    { label: 'Fournisseur', value: 'SUPPLIER' },
  ];

  user!: User;
  private destroy$: Subject<void> = new Subject<void>();
  services: {service: string}[] = [];

  isLoading = false;
  users : User[]=[];
  filteredEmails : string[] = [];
  allEmails : string[] = [];

  activeFilters: { key: keyof UserFilter; label: string; value: string }[] = [];


  constructor(
    protected authService: AuthService,
    private alertService: AlertService,
    protected userService: UserService) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  from: any;
  to: any;
  visible: boolean =false;
  selectedUser: User | null = null;


  loadUsers(){
    this.isLoading = true;
    this.userService.loadUsers(this.userService.filters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{
          this.isLoading = false;
        })
      )
      .subscribe({
        next : (res: ResponseWrapper<User[]>)=> {
          this.users = res.data;
          this.updateActiveFilters()
          this.allEmails = this.users
            .map(u => u.email)
            .filter(email => !!email);

        },
        error:(err:any)=>{
          this.alertService.error('Error when loading user list ')
          console.error(`Error when loading user list : ${err}`)
        }
      })
  }

  delete(product: any) {

  }

  getRole(role: ERole): string {

    switch(role){
      case ERole.ADMIN:
        return 'admin';
      case ERole.RESTORER:
        return 'Restorer';
      case ERole.SUPPLIER:
        return 'Supplier';
      case ERole.CUSTOMER:
        return 'Client';
      default:
        return 'Undefined'
    }
  }

  getSeverity(value: boolean | string): string {

    if (typeof value === 'boolean') {
      return value ? 'success' : 'danger';
    }

    switch (value.toUpperCase()) {
      case 'ADMIN':
        return 'danger';
      case 'RESTORER':
        return 'warning';
      case 'SUPPLIER':
        return 'info';
      case 'CUSTOMER':
        return 'success';
      default:
        return 'secondary';
    }

    return 'secondary'; // valeur par défaut
  }

  showDialog(user: User) {
    this.isLoading = true;
    if(!user) return
    this.selectedUser = user;
    this.visible = true;
    this.isLoading = false;
  }

  protected readonly Status = Status;

  closeDialog() {
    this.visible = false;
    this.selectedUser = null;

  }

  toggleActive(selectedUser: User | null) {
    if(!selectedUser) return ;
    this.isLoading = true;
    this.userService.toggleActive(selectedUser.id)
      .subscribe({
        next:(user : ResponseWrapper<User>)=>{
          selectedUser.active = user.data.active;
          this.isLoading = false;
          this.alertService.success("User account activated")
          this.closeDialog()
          this.loadUsers()
        },
        error:(err)=>{
          console.error(`Error when activation",${err}`)
          this.alertService.error(`Error when approving",${err}`)
        }
      })
  }

  verifyUser(selectedUser: User | null) {
    if(!selectedUser) return ;
    this.isLoading = true;
    this.userService.verifyUser(selectedUser.id)
      .subscribe({
        next:(data : ResponseWrapper<User>)=>{
          //selectedUser.isVerified = true;
          this.isLoading = false;
          this.alertService.success("User approved")
          this.closeDialog()
        },
        error:(err)=>{
          console.error(`Error when approving",${err}`)
          this.alertService.error(`Error when approving",${err}`)
        }
      })
  }

  filterEmails(event: any){
    const query = event.query.toLowerCase();
    this.filteredEmails = this.allEmails.filter(email =>
    email.toLowerCase().includes(query));
  }

  updateActiveFilters() {
    const f = this.userService.filters;
    this.activeFilters = [];

    if (f.email) {
      const emailValue = typeof f.email === 'string' ? f.email : (f.email as any).email;
      this.activeFilters.push({
        key: 'email',
        label: 'Email',
        value: emailValue
      });
    }

    if (f.roles && f.roles.length > 0) {
      const selectedLabels = this.roles
        .filter(r => f.roles?.includes(r.value))
        .map(r => r.label);
      this.activeFilters.push({
        key: 'roles',
        label: 'Rôle',
        value: selectedLabels.join(', ')
      });
    }

    if (f.status) {
      const statuses = Array.isArray(f.status) ? f.status : [f.status];
      statuses.forEach(st => {
        const statusLabel = this.status.find(s => s.value === st)?.label || st;
        this.activeFilters.push({
          key: 'status',
          label: 'Statut',
          value: statusLabel
        });
      });
    }
  }

  removeFilter(filterKey: keyof UserFilter){
    this.userService.clearFilter(filterKey);
    this.loadUsers();
  }

}
