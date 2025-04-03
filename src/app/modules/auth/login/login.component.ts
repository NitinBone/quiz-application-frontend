import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../services/auth.service';
import { UserStorageService } from '../services/user-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private fb:FormBuilder,
      private message: NzMessageService,
      private router: Router,
      private authService: AuthService
    ){}
  
    validateForm!: FormGroup;

    ngOnInit(){
      this.validateForm = this.fb.group({
        email: [null, Validators.required],
        password: [null, Validators.required]
      })
    }

    loginForm() {
      this.authService.login(this.validateForm.value).subscribe(res => {
        
          const user = {
            id: res.userId ?? null,   // if undefined, store null
            role: res.role ?? '' ,  // if undefined, store empty string
            courseId: res.course.id ?? null
        };
        
        UserStorageService.saveUser(user);
         
  
          if (UserStorageService.isAdminLoggedIn()) {
            console.log('Redirecting to Admin Dashboard');
            this.router.navigateByUrl('admin/dashboard');
        } else if (UserStorageService.isUserLoggedIn()) {
            console.log('Redirecting to User Dashboard');
            this.router.navigateByUrl('user/dashboard');
        } else {
            console.warn('User role not found. Cannot redirect.');
        }
    }, error => {
        this.message.error(`Bad credentials`, { nzDuration: 5000 });
    });
  }
  
}
