import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { GnomesService } from 'src/app/services/gnomes.service';
import { Gnome } from 'src/app/interfaces/gnome';

@Component({
  selector: 'app-gnome',
  templateUrl: './gnome.component.html',
  styleUrls: ['./gnome.component.scss']
})
export class GnomeComponent implements OnInit {

  gnomeId: number;
  gnome: Gnome;

  constructor(
    private gnomesService: GnomesService,
    private activeRoute: ActivatedRoute,
    private router: Router 
  ) {
    if (this.gnomesService.getGnomesList() === undefined) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.gnomeId = params.id;
      this.gnome = this.gnomesService.getGnomeById(this.gnomeId);
    });
  }

  /**
   * returns if a gnome has items in the works list
   */
  gnomeHasWork(): boolean {
    return (this.gnome.professions.length > 0);
  }

  /**
   * returns if a gnome has items in the friends list
   */
  gnomeHasFriends(): boolean {
    return (this.gnome.friends.length > 0);
  }

  /**
   * navigates to the page of a gnome friend
   * @param friend name of the friend to show
   */
  showFriend(friend: string): void {
    const friendId = this.gnomesService.getFriendId(friend);
    this.router.navigate(['/gnome', friendId]);
    this.gnomesService.addFriendsHistory(this.gnomeId);
  }

  /**
   * returns if there are items in the history of friends querying
   */
  haveFriendsHistory(): boolean {
    return this.gnomesService.getTotalFriendsHistory() > 0;
  }

  /**
   * in the historial of friends querying, returns one back
   */
  backFriend(): void {
    this.router.navigate(['/gnome', this.gnomesService.getLastFriendsHistory()]);
  }

  /**
   * returns to the list of gnomes
   */
  backList(): void {
    this.router.navigate(['/list']);
  }
}
