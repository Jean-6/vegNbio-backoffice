import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private messageService: MessageService) { }

  success(message: string, summary:string = 'Succès') {
    this.messageService.add({severity: 'success', summary: summary, detail: message,life:3000});
  }

  error(message: string, summary: string = 'Erreur'){
    this.messageService.add({severity: 'error', summary: summary, detail: message,life:3000});
  }

  info(message: string, summary: string = 'Information'){
    this.messageService.add({severity: 'info', summary: summary, detail: message,life:3000});

  }

  warn(message: string , summary: string = 'Avertissement'){
    this.messageService.add({severity: 'warn', summary: summary, detail: message,life:3000});
  }

  clear(){
    this.messageService.clear()

  }
}
