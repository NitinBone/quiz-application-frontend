import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NzNotificationComponent, NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-question-in-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-question-in-test.component.html',
  styleUrl: './add-question-in-test.component.scss'
})
export class AddQuestionInTestComponent {
  questionForm!: FormGroup;
  quizId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notification: NzNotificationService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get Quiz ID from URL
    this.quizId = Number(this.activeRouter.snapshot.params['id']);
    console.log("Quiz ID:", this.quizId); // Debugging


    // Initialize Form
    this.questionForm = this.fb.group({
      questionText: [null, [Validators.required]],
      questionType: ['SINGLE_CORRECT', [Validators.required]],
      answerOptions: this.fb.array([])
    });

    // Set initial options based on default type
    this.updateAnswerOptions();
  }

  // Get Answer Options FormArray
  get answerOptions() {
    return this.questionForm.get('answerOptions') as FormArray;
  }

  // Create Answer Option Form Group
  createAnswerOption(text: string = '', correct: boolean = false) {
    return this.fb.group({
      optionText: [text, Validators.required],
      isCorrect: [correct]
    });
  }

  // Update Answer Options based on Question Type
  updateAnswerOptions() {
    this.answerOptions.clear();

    const questionType = this.questionForm.get('questionType')?.value;

    if (questionType === 'TRUE_FALSE') {
      this.answerOptions.push(this.createAnswerOption('True', false));
      this.answerOptions.push(this.createAnswerOption('False', false));
    } else {
      // Single or Multiple Correct → Show 4 blank options
      for (let i = 0; i < 4; i++) {
        this.answerOptions.push(this.createAnswerOption());
      }
    }
  }

  // Add New Answer Option (for Single/Multiple choice)
  addAnswerOption() {
    if (this.questionForm.get('questionType')?.value !== 'TRUE_FALSE') {
      this.answerOptions.push(this.createAnswerOption());
    }
  }

  // Remove Answer Option (for Single/Multiple choice)
  removeAnswerOption(index: number) {
    if (this.answerOptions.length > 2) {
      this.answerOptions.removeAt(index);
    }
  }

  // Submit Form Data
  submitForm() {
    if (this.questionForm.invalid) {
      this.notification.error('Error', 'Please fill all required fields');
      return;
    }

    // Prepare Data for API
    const payload = {
      quizId: this.quizId,
      questionDto: {
        questionText: this.questionForm.value.questionText,
        questionType: this.questionForm.value.questionType
      },
      answerOptionDtos: this.questionForm.value.answerOptions
    };

    // Send API Request
    this.adminService.addQuestion(payload).subscribe({
      next: (res) => {
        this.notification.success('Success', 'Question added successfully');
        this.router.navigate(['/admin/add-question/', this.quizId]);
      },
      error: (err) => {
        this.notification.error('Error', 'Failed to add question');
        console.error(err);
      }
    });
  }
}