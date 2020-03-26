import { Component } from '@angular/core';
import { GnomesService } from './services/gnomes.service';
import { LoaderService } from './services/loader.service';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private gnomesService: GnomesService,
    private loaderService: LoaderService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gnomesService.loadGnomes()
      .pipe(
        finalize(() => {
          this.loaderService.setLoading(false);
        })
      )
      .subscribe(
        () => {
          if (this.gnomesService.getTotalGnomes() > 0) {
            this.router.navigate(['/list']);
          } else {
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Ups! No gnomes found!'
              }
            });
          }
        },
        () => {
          console.log('error produced');
        }
      );
  }

  showLoader(): boolean {
    return this.loaderService.getLoading();
  }
}
