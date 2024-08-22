import { Component, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('1000ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  @ViewChild('homeSection') homeSection!: ElementRef;
  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('contactSection') contactSection!: ElementRef;

  scrollToSection(section: string) {
    switch(section) {
      case 'home':
        this.homeSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'services':
        this.servicesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'about':
        this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contact':
        this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }
}
