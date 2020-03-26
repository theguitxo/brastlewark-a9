import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public static removeSpaces(value: string): string {
    return value.split(' ').join('');
  }
}
