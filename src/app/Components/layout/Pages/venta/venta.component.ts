import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

import Swal from 'sweetalert2';
import { Title } from 'chart.js';


@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos:Producto[] = [];
  listaProductosFiltro:Producto[] = [];

  listaProductosParaVenta:DetalleVenta[] = [];
  bloquearBotonRegistrar:boolean = false;

  productoSeleccionado!:Producto;
  tipodePagoPorDefecto:string = 'Efectivo';
  totalPagar: number = 0;

  formularioProductoVenta:FormGroup;
  columnasTabla:string[] = ['producto','cantidad','precio','total','accion'];
  datosDetalleVenta= new MatTableDataSource(this.listaProductosParaVenta)

  //busqueda por nombre de producto
  retornarProductosPorFiltro(busqueda:any):Producto[]{
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLowerCase() : busqueda.nombre.toLowerCase();

    return this.listaProductos.filter(item => item.nombre.toLowerCase().includes(valorBuscado));
  }

  constructor(
    private _fb:FormBuilder,
    private _productoServicio:ProductoService,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  )
  {
    this.formularioProductoVenta = this._fb.group({
      producto:['', Validators.required],
      cantidad:['', Validators.required],
    });

    //lista de productos
    this._productoServicio.lista().subscribe({
      next:(data) =>{
        if(data.status == true){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock>0);
        }
      },
      error:(e => {})
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value =>{
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    })
  }

  ngOnInit(): void {
  }

  //mostrar el producto que se ha seleccionado
  mostrarProducto(producto:Producto):string{
    return producto.nombre;
  }

  productoParaVenta(event:any){
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta(){

    const _cantidad:number = this.formularioProductoVenta.value.cantidad;
    const _precio:number = parseFloat(this.productoSeleccionado.precio);
    const _total = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total; //total

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    })

    //actualizar la venta
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

    this.formularioProductoVenta.patchValue({
      producto:'',
      cantidad:''
    })
  }

  //eliminar producto
  eliminarProducto(detalle:DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto),
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalle.idProducto);

    //actualizar la venta
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  do(){
    
  }

  //registrar venta
  registrarVenta(){

    if (this.listaProductosParaVenta.length > 0) {
      //bloquear para que no presione dos veces el boton
      this.bloquearBotonRegistrar = true;

      const request:Venta = {
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta
      }

      this._ventaServicio.registrar(request).subscribe({
        next:(response)=>{
          if (response.status == true) {


            this.totalPagar = 0.00,
            this.listaProductosParaVenta = [];
            // actualizar tabla
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

            Swal.fire({
              icon:'success',
              title:'Venta Registrada!',
              text: `Numero de Venta ${response.value.numeroDocumento}`
            });
          }else{
            this._utilidadServicio.mostrarAlerta('No se pudo registrar la venta','Oops!')
          }
        },
        complete:()=>{
          this.bloquearBotonRegistrar = false;
        },
        error:(e)=>{}
      })
    }
  }

}
