import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Venta } from '../Interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi:string = environment.endpoint + 'Venta/';

  constructor( private _http:HttpClient ) { }

  registrar(request:Venta):Observable<ResponseApi>{
    return this._http.post<ResponseApi>(`${this.urlApi}Registrar`, request);
  }

  historial(buscarPor:string, numeroVenta:string, fechaInicio:string, fechaFin:string):Observable<ResponseApi>{
    return this._http.get<ResponseApi>(`${this.urlApi}Historial?buscarPor${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  reporte(fechaInicio:string, fechaFin:string):Observable<ResponseApi>{
    return this._http.get<ResponseApi>(`${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
