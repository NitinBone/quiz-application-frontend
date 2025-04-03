import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { UserStorageService } from '../../../auth/services/user-storage.service';

@Component({
  selector: 'app-test-submitted',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './test-submitted.component.html',
  styleUrl: './test-submitted.component.scss'
})
export class TestSubmittedComponent {


  constructor(private router: Router){}

goToDashboard() {
  this.router.navigate(['/user/dashboard']);
  window.localStorage.removeItem('testResult');

}

  testResult: any = null;

  ngOnInit() {
     this.testResult=UserStorageService.getResult();
    console.log(this.testResult);  // Call directly on class
  }  
}
