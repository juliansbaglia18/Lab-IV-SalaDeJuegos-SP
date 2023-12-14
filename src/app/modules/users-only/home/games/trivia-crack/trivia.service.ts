import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {

  private apiUrl: string = 'https://api.pexels.com/v1/photos/'
  private apiKey = '563492ad6f9170000100000136935b1e01644a35821a5c743140f89a';

  public fotoSrc!: string;
  private header!: HttpHeaders;

  constructor(
    private http: HttpClient,
    ) { }

  public ObtenerFoto(id: number){
    this.header = new HttpHeaders({['Authorization']:this.apiKey});
    return this.http.get(this.apiUrl + id.toString(), {headers: this.header, responseType: 'json'});
  }

}
