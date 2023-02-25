import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

// formato de las fechas
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';

import { Venta } from '../../../../Interfaces/venta';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

export const MY_DATA_FORMATS = {
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',   //nombre del mes y año
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda:FormGroup;
  opcionesBusqueda:any[] = [
    {value: 'fecha', descripcion: 'Por fechas'},
    {value: 'numero', descripcion: 'Numero de venta'},
  ]

  columnasTabla:string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  dataInicio:Venta[] = [];
  //Fuente de datos
  dataListaVentas= new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;

  constructor(
    private _fb:FormBuilder,
    private _dialog: MatDialog,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  )
  {
    this.formularioBusqueda = this._fb.group({
      buscarPor: ['fecha'],
      numero:[''],
      fechaInicio:[''],
      fechaFin:['']
    })

    // escuchar cambios en el campo buscarPor
    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value => {
      this.formularioBusqueda.patchValue({
        numero: '',
        fechaInicio: '',
        fechaFin: ''
      })
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataListaVentas.paginator = this.paginacionTabla;
  }

  //Filtros de busqueda
  aplicarFiltroTabla(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaVentas.filter = filterValue.trim().toLocaleLowerCase();
  }

  buscarVentas(){
    let _fechaInicio:string = '';
    let _fechaFin:string = '';

    if(this.formularioBusqueda.value.buscarPor === 'fecha'){
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      // validar fechas - si son invalidas
      if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
        this._utilidadServicio.mostrarAlerta('Debe ingresar ambas fechas', 'Oops!');
        return; // salir de la funcion
      }
    }
    this._ventaServicio.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next:(data)=>{
        if(data.status === true){
          this.dataListaVentas.data = data.value;
        }else{
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
        }
      },
      error:(error)=>{}
    })
  }

  // abrir modal detalle venta
  verDetalleVenta(_venta:Venta){
    this._dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px'
    })
  }




}
