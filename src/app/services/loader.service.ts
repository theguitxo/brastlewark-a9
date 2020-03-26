import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean;
  
  constructor() { }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  getLoading(): boolean {
    return this.loading;
  }
}
