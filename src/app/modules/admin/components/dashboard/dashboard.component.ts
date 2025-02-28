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

  quizzes= [];
  selectedFile: File | null = null;   // For Excel file upload

  constructor(private notification: NzNotificationService,
    private quiService:AdminService
  ) {}

  ngOnInit(){
    this.getAllQuizzes();
  }

  getAllQuizzes(){
    this.quiService.getAllQuiz().subscribe(res=>{
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

  getFormattedTime(time): string{
    const minutes= Math.floor(time/60);
    const seconds =time % 60;
    return `${minutes} minutes ${seconds} seconds`;
  }

  toggleSession(test: any) {
    test.sessionActive = !test.sessionActive; // Toggle status
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
