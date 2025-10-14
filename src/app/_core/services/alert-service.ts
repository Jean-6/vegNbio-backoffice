import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private messageService: MessageService) { }

  success(message: string, summary:string = 'Succès', duration: number = 3000) {
    this.messageService.add({severity: 'success', summary: summary, detail: message,life:duration});
  }

  error(message: string, summary: string = 'Erreur', duration: number = 3000){
    this.messageService.add({severity: 'error', summary: summary, detail: message,life:duration});
  }

  info(message: string, summary: string = 'Information', duration: number = 6000){
    this.messageService.add({severity: 'info', summary: summary, detail: message,life:duration});

  }

  warn(message: string , summary: string = 'Avertissement', duration: number= 6000){
    this.messageService.add({severity: 'warn', summary: summary, detail: message,life:duration});
  }

  clear(){
    this.messageService.clear()
  }
}
