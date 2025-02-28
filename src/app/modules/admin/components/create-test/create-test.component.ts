import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tick } from '@angular/core/testing';
import { AdminService } from '../../services/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-test.component.html',
  styleUrl: './create-test.component.scss'
})
export class CreateTestComponent {

  constructor(private fb:FormBuilder,
    private adminService: AdminService,
    private notification: NzNotificationService,
    private router: Router
  ){}

  quizForm!:FormGroup;

  ngOnInit(){
    this.quizForm= this.fb.group({
      title:[null,Validators.required],
      description: [null, [Validators.required]],
      time: [null,[Validators.required]]
    })
  }

  submitForm(){
    if(this.quizForm.valid){
      this.adminService.createQuiz(this.quizForm.value).subscribe(res=>{
        this.notification
        .success(
          `SUCCESS`,
          `Test Creted Succesfully.`,
          {nzDuration:5000}
        );
        this.router.navigateByUrl("/admin/dashboard");
      },error=>{
        console.log(error)
        this.notification
        .error(
          'ERROR',
          `${error.error}`,
          {nzDuration: 5000}
        );
      })
    }
  }

}
