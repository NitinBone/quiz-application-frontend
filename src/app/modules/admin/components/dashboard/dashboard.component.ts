import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  searchTest: string ='';
  filteredQuizzes = [];
  quizzes= [];
  selectedFile: File | null = null;   // For Excel file upload
searchTerm: string = '';  // To store user input for search
page: number = 0;
size: number = 5;

  constructor(private notification: NzNotificationService,
    private quiService:AdminService
  ) {}

  ngOnInit(){
    this.getAllQuizzes();
  }

  // getAllQuizzes(){
  //   this.quiService.getAllQuiz().subscribe(res=>{
  //     this.quizzes=res;
  //   },error=>{
  //     this.notification
  //     .error(
  //       `ERROR`,
  //       `Something went wrong. try Again`,
  //       {nzDuration: 5000}
  //     )
  //   })
  // }

  // filterQuizzes() {
  //   if (!this.searchTest) {
  //     this.filteredQuizzes = [...this.quizzes]; // Show all if empty
  //   } else {
  //     this.filteredQuizzes = this.quizzes.filter(test =>
  //       test.title.toLowerCase().includes(this.searchTest.toLowerCase())
  //     );
  //   }
  // }

  // Fetch quizzes with search and pagination
  getAllQuizzes() {
    // this.quiService.getAllQuiz(this.searchTerm, this.page, this.size).subscribe({
    //   next: (res) => {
    //     this.quizzes = res.content;
    //   },
    //   error: () => {
    //     this.notification.error(`ERROR`, `Something went wrong. Try again.`, { nzDuration: 5000 });
    //   }
    // });
  }

// Handle search input change
onSearchChange(value: string) {
  this.searchTerm = value;
  this.page = 0;  // Reset to first page
  this.getAllQuizzes();  // Fetch filtered data
}


  getFormattedTime(time): string{
    const minutes= Math.floor(time/60);
    const seconds =time % 60;
    return `${minutes} minutes ${seconds} seconds`;
  }

toggleSession(quizId: number) {
    this.quiService.toggleSession(quizId).subscribe({
        next: (message) => {
            console.log(message);
            alert(message); // This will show "Quiz session status updated to false"
            this.getAllQuizzes();
        },
        error: (err) => {
            console.error('Failed to change status', err);
            alert('Failed to change status. Please try again.');
        }
    });
}



  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

 

  // This triggers file input dialog
triggerFileInput(fileInput: HTMLInputElement) {
  fileInput.click();
}

// When file selected
onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];

  if (this.selectedFile) {
    this.uploadFile();   // Automatically upload after selection
  } else {
    this.notification.warning(
      'No File Selected',
      'Please select an Excel file first.'
    );
  }
}

// Upload file to backend
uploadFile() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.quiService.uploadQuestionsExcel(formData).subscribe({
      next: (response) => {
        this.notification.success(
          'Success',
          'Questions uploaded successfully!'
        );
        this.getAllQuizzes();  // Refresh data after upload
      },
      error: (error) => {
        this.notification.error(
          'Upload Failed',
          'Failed to upload questions. Please try again.'
        );
        console.error('Upload error', error);
      }
    });
  } else {
    this.notification.warning(
      'No File Selected',
      'Please select an Excel file first.'
    );
  }
}


}
