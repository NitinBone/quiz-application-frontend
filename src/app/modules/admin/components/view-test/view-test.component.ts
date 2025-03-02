import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { UserStorageService } from '../../../auth/services/user-storage.service';

@Component({
  selector: 'app-view-test',
  standalone: true,
  imports: [SharedModule,FormsModule,CommonModule],
  templateUrl: './view-test.component.html',
  styleUrl: './view-test.component.scss'
})
export class ViewTestComponent {
  quizInfo:any;
  questions:any[]=[];
  testId:any;
  selectedAnswers: { [key: number]: any } = {}; // Store user selections
  userId:any;
 
  constructor(private adminService:AdminService,
    private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit() {
        this.userId = UserStorageService.getUserId();
    this.activatedRoute.paramMap.subscribe(params => {
      this.testId = +params.get('id');
  
      // this.adminService.getTestQuestion(this.testId).subscribe(res => {
      //   this.quizInfo = res.quizDto;     // Quiz details
      //   this.questions = res.addQuestionDtos;  // List of questions
      //   console.log(this.quizInfo);
      //   console.log(this.questions);
      // });

      this.adminService.getTestQuestion(this.testId, this.userId).subscribe(res => {
        this.quizInfo = res.quizDto;
        this.questions = res.addQuestionDtos;
    });
    });
  }
  

//   selectAnswer(questionId: number, optionId: number) {
//     this.selectedAnswers[questionId] = [optionId]; // For SINGLE and TRUE/FALSE (only one answer allowed)
//   }

//   submitQuiz() {
//     console.log("Selected Answers:", this.selectedAnswers);
//     // Call API to submit the answers
//   }



// toggleMultipleAnswer(questionId: number, optionId: number, isChecked: boolean) {
//   if (!this.selectedAnswers[questionId]) {
//     this.selectedAnswers[questionId] = [];
//   }

//   if (isChecked) {
//     this.selectedAnswers[questionId].push(optionId);
//   } else {
//     this.selectedAnswers[questionId] = this.selectedAnswers[questionId].filter((id: number) => id !== optionId);
//   }
// }

// getChecked(event: Event): boolean {
//   return (event.target as HTMLInputElement).checked;
// }

}
