import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { UtilsService } from '../services/utils.service';
import { LoaderService } from './loader.service';
import { Observable } from 'rxjs';
import { Gnome } from '../interfaces/gnome';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GnomesService {

  private totalGnomes: number;
  private gnomesByName: any;
  private gnomesList: Array<Gnome>;
  private filter: string;

  private page: number;
  private byPage: number;
  private byPageOptions: Array<number>;
  private totalFiltered: number;

  private friendsHistory: Array<number>;

  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService
  ) {
    this.totalGnomes = 0;
    this.gnomesByName = {};
    
    this.filter = '';
    this.totalFiltered = 0;
    this.page = 0;
    this.byPage = 10;
    this.byPageOptions = [10, 25, 50];

    this.friendsHistory = [];
  }

  /**
   * loads the list of gnomes from an URL
   */
  loadGnomes(): Observable<any> {
    this.loaderService.setLoading(true);

    return new Observable(observer => {
      this.httpClient.get(AppConstants.dataURL)
        .pipe(
          finalize(() => {
            observer.complete();
          })
        )
        .subscribe(
        (data) => {
          this.totalGnomes = data[AppConstants.dataProperty].length;
          if (this.totalGnomes > 0) {
            this.gnomesList = data[AppConstants.dataProperty];
            this.listMakeNamesList();
          }
          observer.next();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  /**
   * returns the list of all gnomes
   */
  getGnomesList(): Array<Gnome> {
    return this.gnomesList;
  }

  /**
   * returns the total of loaded gnomes
   */
  getTotalGnomes(): number {
    return this.totalGnomes;
  }

  /**
   * returns the information of a gnome
   * @param id key of the gnome into the list
   */
  getGnomeById(id: number): Gnome {
    return this.gnomesList[id];
  }

  /**
   * makes a list where the keys are the names of gnomes
   * and the value their position in the list
   * is used to find speedly their identification using their name
   */
  private listMakeNamesList(): void {
    this.gnomesList.forEach((gnome: Gnome, index: number) => {
      this.gnomesByName[UtilsService.removeSpaces(gnome.name)] = index;
    });
  }

  /**
   * sets the value for the page to show in the list
   * @param value page to show
   */
  setPage(value: number) {
    this.page = value;
  }

  /**
   * returns the current page of the list
   */
  getPage(): number {
    return this.page;
  }

  /**
   * sets the number of items to show in a page in the list
   * @param value the number of items for page
   */
  setByPage(value: number) {
    this.byPage = value;
  }

  /**
   * returns the number of items for page
   */
  getByPage(): number {
    return this.byPage;
  }

  /**
   * returns a list with the available options for the items by page
   */
  getByPageOptions(): Array<number> {
    return this.byPageOptions;
  }

  /**
   * sets the value used to filter the list
   * @param value a string as the value to filter
   */
  setFilter(value: string) {
    this.filter = value;
  }

  /**
   * returns the current value used to filter the list
   */
  getFilter(): string {
    return this.filter;
  }

  /**
   * filters the list according the string entered by the user an returns the result
   */
  filterGnomes(): Array<Gnome> {
    let result: Array<Gnome> = this.gnomesList;
    if (this.filter) {
      result = this.gnomesList.filter(item => RegExp(this.filter, 'i').exec(item.name));
    }
    this.totalFiltered = result.length;
    
    const start = this.page * this.byPage;
    const end = start + this.byPage;
  
    result = result.slice(start, end);
    return result;
  }

  /**
   * returns the number of gnomes after filter them
   */
  getTotalFiltered(): number {
    return this.totalFiltered;
  }

  /**
   * returns the identification in the list of a friend for a gnome
   * @param name name of the friend to get the identification
   */
  getFriendId(name: string): number {
    return this.gnomesByName[UtilsService.removeSpaces(name)];
  }

  /**
   * resets the history of friend querying
   */
  resetFriendsHistory(): void {
    this.friendsHistory = [];
  }

  /**
   * adds an item to the list of friends queried
   * @param value 
   */
  addFriendsHistory(value: number): void {
    this.friendsHistory.push(value);
  }

  /**
   * returns the total of friends queried
   */
  getTotalFriendsHistory(): number {
    return this.friendsHistory.length;
  }

  /**
   * returns the identification of the last friend queried
   */
  getLastFriendsHistory(): number {
    return this.friendsHistory.pop();
  }
}
