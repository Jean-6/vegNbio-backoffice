import { Injectable } from '@angular/core';
import {EventFilter} from '../dto/eventFilter';
import {HttpClient} from '@angular/common/http';
import {AddMenuItem} from '../dto/addMenuItem';
import {Observable} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrlMenu ="http://localhost:8082/api/menu";

  constructor(private http: HttpClient) {}


  saveItemMenuWithPictures( menuItem: AddMenuItem, pictures: File[]): Observable<ResponseWrapper<any>> {
    const formData = new FormData();

    // Add JSON object as Blob
    const jsonBlob = new Blob([JSON.stringify(menuItem)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    // Add files
    pictures.forEach(file => formData.append('pictures', file, file.name));

    // Envoyer le POST
    return this.http.post<ResponseWrapper<any>>(
      `${this.apiUrlMenu}/`,
      formData
    );

  }

}
