import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'howto-dialog-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: [
    './delete-project.component.scss',
  ],
})
export class DialogDeleteProjectComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteProjectComponent>,
  ) { }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onDelete(): void {
    this.dialogRef.close(true);
  }
}
