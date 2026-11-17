import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-landscape',
  styles: `
    .blades {
      transform-origin: 1040px 258px;
      animation: turn 40s linear infinite;
    }
    .cloud {
      animation: drift linear infinite;
    }
    @keyframes turn {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes drift {
      from {
        transform: translateX(var(--from));
      }
      to {
        transform: translateX(var(--to));
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .blades,
      .cloud {
        animation: none;
      }
    }
  `,
  templateUrl: './landscape.component.html',
  host: {
    class: 'pointer-events-none fixed inset-x-0 bottom-0 -z-10 block h-[45svh] min-h-64',
    'aria-hidden': 'true',
  },
})
export class LandscapeComponent {}
