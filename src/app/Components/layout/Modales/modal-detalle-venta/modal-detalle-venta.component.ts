import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';//Datos del modal
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  fechaRegistro:string = '';
  numeroDocumento:string = '';
  tipoPago:string = '';
  total: string = '';
  detalleVenta: DetalleVenta[] = [];

  columnasTabla:string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public _venta:Venta,
    )
    {
      this.fechaRegistro = this._venta.fechaRegistro!;
      this.numeroDocumento = this._venta.numeroDocumento!;
      this.tipoPago = this._venta.tipoPago;
      this.total = this._venta.totalTexto;
      this.detalleVenta = this._venta.detalleVenta;
    }

  ngOnInit(): void {
  }

}
