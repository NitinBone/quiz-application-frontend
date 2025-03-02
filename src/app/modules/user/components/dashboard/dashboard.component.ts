import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  quizzes = [];

  constructor(private notification:NzNotificationService,
    private quizService:QuizService
  ){}

  ngOnInit(){
    this.getAllQuizzes();
  }

  getAllQuizzes(){
    this.quizService.getAllQuiz().subscribe(res=>{
      this.quizzes=res;
      console.log('res'+res);
      console.log('quiz'+this.quizzes);
    },error=>{
      this.notification
      .error(
        `ERROR`,
        `Something went wrong. try Again`,
        {nzDuration: 5000}
      )
    })
  }
  
}
