import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-test-submitted',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './test-submitted.component.html',
  styleUrl: './test-submitted.component.scss'
})
export class TestSubmittedComponent {

}
