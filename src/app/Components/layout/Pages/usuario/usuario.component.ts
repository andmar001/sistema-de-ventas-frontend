import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
//alerts
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTabla:string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones'];
  dataInicio:Usuario[] = [];
  //Fuente de datos
  dataListaUsuarios:MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>(this.dataInicio);
  //Paginador
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;

  constructor(
    private _dialogo: MatDialog,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService
  ) { }

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
      next: (data) => {
        if(data.status == true){
          this.dataListaUsuarios.data = data.value;
        }else{
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
        }
      },
      error: (error) => { }
    })
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  //Filtros de busqueda
  aplicarFiltroTabla(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  //Modal
  nuevoUsuario(){
    this._dialogo.open(ModalUsuarioComponent, {
      disableClose: true, // no se puede cerrar haciendo click fuera del modal
    }).afterClosed().subscribe( resultado =>{
      if(resultado == "true"){
        this.obtenerUsuarios();
      }
    });
  }

  //Editar
  editarUsuario(usuario:Usuario){
    this._dialogo.open(ModalUsuarioComponent, {
      disableClose: true, // no se puede cerrar haciendo click fuera del modal
      data: usuario       // datos que se envian al modal
    }).afterClosed().subscribe( resultado =>{
      if(resultado == "true"){
        this.obtenerUsuarios();
      }
    });
  }

  //Eliminar
  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if(resultado.isConfirmed){  // si se confirma la eliminacion
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if( data.status == true){
              this._utilidadServicio.mostrarAlerta('El usuario fue eliminado', 'Listo!');
              this.obtenerUsuarios();
            }else{
              this._utilidadServicio.mostrarAlerta('No se pudo eliminar el usuario', 'Error!');
            }
          },
          error: (error) => { }
        })
      }
    })
  }

}
