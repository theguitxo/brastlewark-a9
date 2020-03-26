import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-overflow');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-overflow');
  }
}
