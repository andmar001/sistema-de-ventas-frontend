import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';//Datos del modal
import { Rol } from '../../../../Interfaces/rol';
import { Usuario } from '../../../../Interfaces/usuario';

import { RolService } from '../../../../Services/rol.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formularioUsuario:FormGroup;
  ocultarPassword : boolean = true;
  tituloAccion : string = 'Agregar';
  botonAccion : string = 'Guardar';
  listaRoles : Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario:Usuario,
    private _fb:FormBuilder,
    private _rolServicio:RolService,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService
  )
  {
    // formulario
    this.formularioUsuario = this._fb.group({
      nombreCompleto: [ '', Validators.required ],
      correo:[ '', Validators.required ],
      idRol:[ '', Validators.required ],
      clave:[ '', Validators.required ],
      esActivo:[ '1', Validators.required ]
    });

    // preguntar si hay datos
    if (this.datosUsuario != null) {
      this.tituloAccion ="Editar";
      this.botonAccion ="Actualizar";
    }

    // obtener roles
    this._rolServicio.lista().subscribe({
      next: (data) => {
        if(data.status == true){
          this.listaRoles = data.value;
        }
      },
      error: (error) => { }
    })

  }

  ngOnInit(): void {
    // *Cargamos los datos del usuario en el formulario
    if (this.datosUsuario != null) {
      this.formularioUsuario.setValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      });
    }
  }

  //metodo para crear o actualizar
  guardarEditar_Usuario(){
    // *Obtenemos los datos del formulario para editar o crear
    const _usuario:Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    // *Validamos si es para crear o actualizar
    if (this.datosUsuario == null) {
      // *Creamos el usuario
      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status == true){
            this._utilidadServicio.mostrarAlerta( 'El ususario fue registrado ', 'Exito' );
            this.modalActual.close('true');
          }else{
            this._utilidadServicio.mostrarAlerta( 'No se pudo registrar el usuario', 'Error' );
          }
        },
        error: (error) => { }
      })
    }
    // *Editamos el usuario
    else{
      this._usuarioServicio.editar(_usuario).subscribe({
        next: (data) => {
          if(data.status == true){
            this._utilidadServicio.mostrarAlerta( 'El ususario fue editado ', 'Exito' );
            this.modalActual.close('true');
          }else{
            this._utilidadServicio.mostrarAlerta( 'No se pudo editar el usuario', 'Error' );
          }
        },
        error: (error) => { }
      })
    }

  }

}
