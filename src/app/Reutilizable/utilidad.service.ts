import { Injectable } from '@angular/core';

import { MatSnackBar } from "@angular/material/snack-bar";
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor( private _snackBar:MatSnackBar ) { }

  // *Método para mostrar un mensaje en la parte inferior de la pantalla - metodo generico
  mostrarAlerta( mensaje:string, tipo:string ){
    this._snackBar.open( mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  // *Método para guardar la sesión del usuario
  guardarSesionUsuario( usuarioSesion:Sesion ){
    // *Guardamos la sesión del usuario en el localStorage.
    localStorage.setItem( 'usuario', JSON.stringify( usuarioSesion ) );
  }

  // *Método para obtener la sesión del usuario
  obtenerSesionUsuario(){
    const dataCadena = localStorage.getItem( 'usuario' );

    const usuario = JSON.parse( dataCadena! ); // !Forzamos a que no sea nulo
    return usuario;
  }

  // *Método para eliminar la sesión del usuario
  eliminarSesionUsuario(){
    localStorage.removeItem( 'usuario' );
  }
}
