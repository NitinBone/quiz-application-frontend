import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuizService } from '../../services/quiz.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input'; // For search input
import { NzCardModule } from 'ng-zorro-antd/card'; // For displaying quizzes
import { NzButtonModule } from 'ng-zorro-antd/button'; // For Start Test button
import { NzPaginationModule } from 'ng-zorro-antd/pagination'; // For pagination
import { UserStorageService } from '../../../auth/services/user-storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, NzInputModule,
    NzCardModule,
    NzButtonModule,
    NzPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  quizzes: any[] = [];
  searchControl = new FormControl('');
  totalElements = 0; // Total number of quizzes from the backend
  pageSize = 2; // Number of items per page
  currentPage = 0; // Current page
  courseId=0;
  

  constructor(private notification: NzNotificationService, private quizService: QuizService) {}

  ngOnInit() {
this.courseId=UserStorageService.getUser().courseId;


    this.getAllQuizzes(); // Load quizzes initially

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.currentPage = 0; // Reset to the first page when searching
        this.getAllQuizzes(searchTerm);
      });
  }

  getAllQuizzes(searchTerm: string = '') {
    const query = searchTerm ? searchTerm : ''; // Default query if empty
    const url = `http://localhost:8080/api/quiz/search?text=${query}&courseId=${this.courseId}&page=${this.currentPage}&size=${this.pageSize}`;

    this.quizService.searchQuizzes(url).subscribe(
      res => {
        this.quizzes = res.content; // Load quiz data
        this.totalElements = res.totalElements; // Store total elements for pagination
      },
      error => {
        this.notification.error('ERROR', 'Something went wrong. Try again.', { nzDuration: 5000 });
      }
    );
  }

  onPageChange(page: number) {  
    this.currentPage = page - 1; // Adjust to zero-based index
    this.getAllQuizzes(this.searchControl.value); // Fetch new page data
  }
}
