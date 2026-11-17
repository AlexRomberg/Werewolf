import { LandscapeComponent } from '../../components/landscape/landscape.component';
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideGlobe } from '@lucide/angular';
import { DividerComponent } from '../../components/divider/divider.component';

@Component({
  selector: 'app-home',
  imports: [LandscapeComponent, DividerComponent, RouterLink, NgOptimizedImage, LucideGlobe],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
