import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private API_SERVER = "http://127.0.0.1:5000";
  private NUMBER_PREDICTION = '/predict'


  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(){
    return this.httpClient
    .get(this.API_SERVER + this.NUMBER_PREDICTION)
    .pipe(retry(3),catchError(this.handleError));
  }

  public uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);

    return this.httpClient.post(this.API_SERVER + '/predict', formData);
  }

  public uploadBlob(image: Blob) {
    const formData = new FormData();
    formData.append('image', image);

    return this.httpClient.post(this.API_SERVER + '/predict', formData);
  }

/*
  public getPrediction(){
    return this.httpClient.post(this.API_SERVER + this.NUMBER_PREDICTION, );
  }
*/

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };
}
