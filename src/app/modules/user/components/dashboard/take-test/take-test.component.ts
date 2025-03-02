import { Component } from '@angular/core';
import { UserStorageService } from '../../../../auth/services/user-storage.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './take-test.component.html',
  styleUrl: './take-test.component.scss'
})
export class TakeTestComponent {

  errorMessage = '';  // To show the actual error message
  errorOccur = true;
  questions:any[]=[];
  testId:any;
  quizInfo:any;
  selectedAnswers: { [key: number]: any } = {}; // Store user selections
  userId: number | null = null;  // Use number or 


  constructor(private quizService:QuizService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) {  }

  ngOnInit() {
    this.userId = UserStorageService.getUserId();
      this.activatedRoute.paramMap.subscribe(params => {
        this.testId = +params.get('id');
    
        // this.quizService.getTestQuestion(this.testId).subscribe(res => {
        //   this.quizInfo = res.quizDto;     // Quiz details
        //   this.questions = res.addQuestionDtos;  // 
        // });


        this.quizService.getTestQuestion(this.testId, this.userId).subscribe({
          next: (res) => {
            this.errorOccur=false;
              this.quizInfo = res.quizDto;
              this.questions = res.addQuestionDtos;
          },
          error: (err) => {
              console.error('ERROR', err);  // This logs the full error object (not just the message)
              this.errorOccur=true;
              this.errorMessage = err.error?.message || 'Failed to load quiz questions.';

              if (err.status === 403) {
                this.router.navigateByUrl("user/dashboard");
                  const errorMessage = err.error?.message || 'You are not allowed to take this test.';
                  alert(errorMessage);   // Show proper message
              } else {
                  alert('Something went wrong while fetching the quiz.');
              }
          }
      });
      
      
      });
    
  }

  
  selectAnswer(questionId: number, optionId: number) {
    this.selectedAnswers[questionId] = [optionId]; // For SINGLE and TRUE/FALSE (only one answer allowed)
  }

  submitQuiz() {
    const submitTestDto = {
      quizId: this.testId,   // testId already fetched in ngOnInit
      userId: this.userId,   // Fetched in ngOnInit
      responce: this.mapSelectedAnswersToResponce()
    };
  
    this.quizService.submitTest(submitTestDto).subscribe({
      next: (response) => {
        console.log('Test submitted successfully', response);
        alert('Test submitted successfully!');
        this.router.navigate(['/user/test-submitted']);   // Navigate to "test-submitted" page (create this component)
      },
      error: (error) => {
        console.error('Failed to submit test', error);
        alert('Failed to submit the test. Please try again.');
      }
    });
  }
  
  // Helper method to map selectedAnswers object into required array format
  mapSelectedAnswersToResponce() {
    return Object.keys(this.selectedAnswers).map(questionId => ({
      questionId: Number(questionId),   // Convert string key to number
      selectedOptionIds: this.selectedAnswers[questionId]
    }));
  }
  


toggleMultipleAnswer(questionId: number, optionId: number, isChecked: boolean) {
  if (!this.selectedAnswers[questionId]) {
    this.selectedAnswers[questionId] = [];
  }

  if (isChecked) {
    this.selectedAnswers[questionId].push(optionId);
  } else {
    this.selectedAnswers[questionId] = this.selectedAnswers[questionId].filter((id: number) => id !== optionId);
  }
}

getChecked(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}
}
