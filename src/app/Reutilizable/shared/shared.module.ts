import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//material components
import { MatCardModule } from '@angular/material/card';    //tarjetas
import { MatInputModule } from '@angular/material/input';    //input - text
import { MatSelectModule } from '@angular/material/select';  //select
import { MatProgressBarModule } from '@angular/material/progress-bar'; //spinner
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; //spinner
import { MatGridListModule } from '@angular/material/grid-list'; //grid

// TODO: Para trabajar con el menu
import { LayoutModule } from '@angular/cdk/layout'; //layout
import { MatToolbarModule } from '@angular/material/toolbar';   //toolbar
import { MatSidenavModule } from '@angular/material/sidenav';   //sidenav
import { MatButtonModule } from '@angular/material/button';    //button
import { MatIconModule } from '@angular/material/icon';        //icon
import { MatListModule } from '@angular/material/list';        //list

import { MatTableModule } from '@angular/material/table'; //table
import { MatPaginatorModule } from '@angular/material/paginator'; //paginator
import { MatDialogModule } from '@angular/material/dialog'; //dialog or modal
import { MatSnackBarModule } from '@angular/material/snack-bar'; //snackbar - alertas
import { MatTooltipModule } from '@angular/material/tooltip'; //tooltip - alertas al pasar el mouse
import { MatAutocompleteModule } from '@angular/material/autocomplete'; //autocomplete
import { MatDatepickerModule } from '@angular/material/datepicker'; //datepicker fechas

import { MatNativeDateModule} from '@angular/material/core'; //datepicker fechas
import { MomentDateModule } from '@angular/material-moment-adapter'; //datepicker fechas-cambiar formato de fecha


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:
  [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SharedModule {}
