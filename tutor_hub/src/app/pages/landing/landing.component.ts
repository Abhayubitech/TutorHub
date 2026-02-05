import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('heroVideo') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.forceVideoPlay();
  }

  forceVideoPlay() {
    const video = this.videoElement.nativeElement;
    video.muted = true;
    video.setAttribute('muted', '');
    
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
      }).catch(() => {
        window.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    }

    video.addEventListener('ended', () => {
      video.play();
    });
  }
}