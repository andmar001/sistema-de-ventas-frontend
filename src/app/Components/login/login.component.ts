import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Login } from '../../Interfaces/login';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formularioLogin:FormGroup;

  ocultarPassword:boolean = true;

  mostrarLoading:boolean = false;

  constructor( private _fb:FormBuilder,
               private _router:Router,
               private _usuarioServicio:UsuarioService,
               private _utilidadServicio:UtilidadService
    ) {
      this.formularioLogin = this._fb.group({
        email:['', Validators.required],
        password:['', Validators.required],
      })

    }

  ngOnInit(): void {
  }

  //ejecutado cuando se hace click en el boton de iniciar sesion
  iniciarSesion(){
    this.mostrarLoading = true;

    const request:Login = {
      correo: this.formularioLogin.get('email')?.value,
      clave: this.formularioLogin.get('password')?.value
    }

    this._usuarioServicio.iniciarSesion( request ).subscribe({
      next: (data) => {
        // *Si el status es true, entonces encontro el usuario
        if (data.status) {
          this._utilidadServicio.guardarSesionUsuario( data.value ); // *Guardamos la sesión del usuario en el localStorage
          this._router.navigate(["pages"]); // *Redireccionamos a pages
        }
        else{
          this._utilidadServicio.mostrarAlerta( 'No se encontraron concidencias','Opps' );
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilidadServicio.mostrarAlerta( 'Hubo un error','Opps' );
      }
    })
  }

}
