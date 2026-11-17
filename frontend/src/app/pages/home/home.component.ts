import { LandscapeComponent } from '../../components/landscape/landscape.component';
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideChevronRight, LucideGlobe } from '@lucide/angular';

@Component({
  selector: 'app-home',
  imports: [LandscapeComponent, RouterLink, NgOptimizedImage, LucideChevronRight, LucideGlobe],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
