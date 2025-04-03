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

  //for time
  quizDurationMinutes = 30;   // Default time (can be overridden if your quiz DTO has a time field)
  timeLeftInSeconds!: number;
  timerInterval: any;

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

              if (this.quizInfo.duration) {
                this.quizDurationMinutes = this.quizInfo.duration;
              }
              this.startTimer();
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

  startTimer() {
    this.timeLeftInSeconds = this.quizDurationMinutes * 60;

    this.timerInterval = setInterval(() => {
      if (this.timeLeftInSeconds > 0) {
        this.timeLeftInSeconds--;
      } else {
        clearInterval(this.timerInterval);
        alert('Time is up! Your test is being submitted automatically.');
        this.submitQuiz();  // Auto-submit when timer runs out
      }
    }, 1000);
  }
  
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeftInSeconds / 60);
    const seconds = this.timeLeftInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }


  selectAnswer(questionId: number, optionId: number) {
    this.selectedAnswers[questionId] = [optionId]; // For SINGLE and TRUE/FALSE (only one answer allowed)
  }

  submitQuiz() {

     // Check if all questions are answered
  const unansweredQuestions = this.questions.filter(question => 
    !this.selectedAnswers[question.questionDto.id] || 
    this.selectedAnswers[question.questionDto.id].length === 0
  );

  if (unansweredQuestions.length > 0) {
    alert('Please answer all questions before submitting the test.');
    return; // Stop the submission process
  }
    
    const submitTestDto = {
      quizId: this.testId,   // testId already fetched in ngOnInit
      userId: this.userId,   // Fetched in ngOnInit
      responce: this.mapSelectedAnswersToResponce()
    };
  
    this.quizService.submitTest(submitTestDto).subscribe({
      next: (response:any) => {
        console.log('Test submitted successfully', response);
        alert('Test submitted successfully!');
    
        
        const testResult = {
          id: response.id ?? null,
          totalQuestion: response.totalQuestion ?? 0,
          correctAnswer: response.correctAnswer ?? 0,
          percentage: response.percentage ?? 0,
          user: {
              id: response.user?.userId ?? null,
              role: response.user?.role ?? ''
          },
          quiz: {
              id: response.quiz?.id ?? 0,
              title: response.quiz?.title ?? '',
              description: response.quiz?.description ?? ''
          }
      };

      UserStorageService.saveResult(testResult);   // Save to storage
  

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


ngOnDestroy() {
  if (this.timerInterval) {
    clearInterval(this.timerInterval);  // Clean up timer when leaving page
  }
}
}
