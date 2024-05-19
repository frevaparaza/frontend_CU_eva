import { Injectable } from '@angular/core';
import {ErrorDialogComponent} from "../../dialogs/error-dialog/error-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(public dialog: MatDialog) { }

  openErrorDialog(errorMsg: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: errorMsg
    });
  }
}
