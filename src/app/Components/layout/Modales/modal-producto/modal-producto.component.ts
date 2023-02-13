import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';//Datos del modal

import { Categoria } from '../../../../Interfaces/categoria';
import { Producto } from '../../../../Interfaces/producto';

import { CategoriaService } from '../../../../Services/categoria.service';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  formularioProducto:FormGroup;
  tituloAccion : string = 'Agregar';
  botonAccion : string = 'Guardar';
  listaCategorias : Categoria[] = [];

  constructor(
    private modalActual:MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto:Producto,
    private _fb:FormBuilder,
    private _categoriaServicio:CategoriaService,
    private _productoServicio:ProductoService,
    private _utilidadServicio:UtilidadService
  )
  {
    // formulario
    this.formularioProducto = this._fb.group({
      nombre: [ '', Validators.required ],
      idCategoria:[ '', Validators.required ],
      stock:[ '', Validators.required ],
      precio:[ '', Validators.required ],
      esActivo:[ '1', Validators.required ]
    });

    // preguntar si hay datos
    if (this.datosProducto != null) {
      this.tituloAccion ="Editar";
      this.botonAccion ="Actualizar";
    }

    // obtener lista de categorias
    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if(data.status == true){
          this.listaCategorias = data.value;
        }
      },
      error: (error) => { }
    })

  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.setValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  // guardar y actualizar
  guardarEditar_Producto(){
    // *Obtenemos los datos del formulario para editar o crear
    const _producto:Producto = {
      idProducto: this.datosProducto != null ? this.datosProducto.idProducto : 0,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    }

    // *Preguntamos si es editar o crear
    if (this.datosProducto == null) {
      // *Creamos el producto
      this._productoServicio.guardar(_producto).subscribe({
        next: (data) => {
          if(data.status == true){
            this._utilidadServicio.mostrarAlerta( 'El usuario fue registrado ', 'Exito' );
            this.modalActual.close('true');
          }else{
            this._utilidadServicio.mostrarAlerta( 'No se pudo registrar el producto', 'Error' );
          }
        },
        error: (error) => { }
      });
    }
    // *Editamos el producto
    else{
      this._productoServicio.editar(_producto).subscribe({
        next: (data) => {
          if(data.status == true){
            this._utilidadServicio.mostrarAlerta( 'El producto fue editado ', 'Exito' );
            this.modalActual.close('true');
          }else{
            this._utilidadServicio.mostrarAlerta( 'No se pudo editar el producto', 'Error' );
          }
        },
        error: (error) => { }
      });
    }
  }

}
