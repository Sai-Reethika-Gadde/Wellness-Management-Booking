import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0}),
        animate('500ms ease-out', style({  opacity:1 })),
      ]),
    ]),
  ],
})
export class RegisterComponent {
  user = {
    username: '',
    fullName: '',
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(private router: Router,private authService: AuthService) {}

  register() {


    this.authService.register(this.user).subscribe(
      response => {
        console.log(response); // Handle success
        // Redirect to login screen or handle as needed
        this.router.navigate(['/login']); // Navigate to dashboard on successful login
       
        
      },
      error => {
        this.errorMessage = 'Registration Failed'; // Display error message
      }
    );
  }


}
