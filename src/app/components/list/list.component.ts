import { Component, OnInit, ElementRef } from '@angular/core';
import { GnomesService } from 'src/app/services/gnomes.service';
import { Gnome } from 'src/app/interfaces/gnome';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  list: Array<Gnome>;
  searchWords: string;

  page: number;
  totalItems: number;
  itemsByPage: number;
  itemsByPageOptions: Array<number>;

  constructor(
    private gnomesService: GnomesService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    if (this.gnomesService.getGnomesList() === undefined) {
      this.router.navigate(['/']);
    }
    this.searchWords = this.gnomesService.getFilter();
    this.page = this.gnomesService.getPage();
    this.itemsByPage = this.gnomesService.getByPage();
    this.itemsByPageOptions = this.gnomesService.getByPageOptions();
  }

  ngOnInit(): void {
    this.filter();
  }

  /**
   * tries to search gnomes (if there aren't words to search, informs it)
   * @param isReset if the user has been press the reset button, to use when checks if search words are set
   */
  search(isReset: boolean = false): void {
    if (this.searchWords === '' && !isReset) {
      this.dialog.open(DialogComponent, {
        data: {
          message: 'Search field empty! Please, enter a name to search'
        }
      });
    } else {
      this.page = 0;
      this.gnomesService.setFilter(this.searchWords);
      this.filter();
    }
  }

  /**
   * sets some values to filter and calls the method of service
   */
  filter(): void {
    this.gnomesService.setPage(this.page);
    this.gnomesService.setByPage(this.itemsByPage);
    this.list = this.gnomesService.filterGnomes();
  }

  /**
   * event called when the user changes the page or the items for page in the list
   * @param event page change event
   */
  changePage(event: PageEvent): void {
    this.page = event.pageIndex;
    this.itemsByPage = event.pageSize;
    this.filter();
  }

  /**
   * returns the total of found gnomes on execute the filter
   */
  totalFiltered(): number {
    return this.gnomesService.getTotalFiltered();
  }

  /**
   * returns if must show the results of a search
   */
  showResults(): boolean {
    return this.totalFiltered() > 0;
  }

  /**
   * returns if must show the reset button of the search form
   */
  showReset(): boolean {
    return (this.searchWords !== '' && this.totalFiltered() !== this.gnomesService.getTotalGnomes());
  }

  /**
   * navigates to the page that show the information of a gnome
   * @param gnome the information about the gnome to show
   */
  loadGnome(gnome: Gnome) {
    this.gnomesService.resetFriendsHistory();
    this.router.navigate(['/gnome', gnome.id]);
  }

  /**
   * resets the result of a filter, showing all the list
   */
  reset(): void {
    this.searchWords = '';
    this.search(true);
  }
}
