import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import lottie from 'lottie-web';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  standalone: false,
})
export class LoaderComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;
  
  private animation: any;
  private isFirstLoad = true;

  constructor(public loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.loading$.subscribe(loading => {
      if (loading && !this.isFirstLoad) {
        setTimeout(() => this.loadLottieAnimation(), 0);
      }
    });
  }

  ngAfterViewInit() {
    this.loadLottieAnimation();
    this.isFirstLoad = false;
  }

  ngOnDestroy() {
    if (this.animation) {
      this.animation.destroy();
    }
  }

  private loadLottieAnimation() {
    if (!this.lottieContainer?.nativeElement) return;

    if (this.animation) {
      this.animation.destroy();
    }

    this.lottieContainer.nativeElement.innerHTML = '';

    this.animation = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/loading.json'
    });
  }
}
