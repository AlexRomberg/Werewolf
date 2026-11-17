import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, LucideChevronRight],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
