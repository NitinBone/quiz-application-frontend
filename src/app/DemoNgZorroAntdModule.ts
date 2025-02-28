import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzTableModule,
    NzIconModule,
    NzFormModule,
    NzCardModule,
    NzModalModule,
    NzNotificationModule,
    NzMessageModule,
    NzSelectModule,
    NzDatePickerModule,
    NzLayoutModule,
    NzMenuModule,
    NzPopoverModule,
    NzDropDownModule
  ],
  exports: [
    NzButtonModule,
    NzInputModule,
    NzTableModule,
    NzIconModule,
    NzFormModule,
    NzCardModule,
    NzModalModule,
    NzNotificationModule,
    NzMessageModule,
    NzSelectModule,
    NzDatePickerModule,
    NzLayoutModule,
    NzMenuModule,
    NzPopoverModule,
    NzDropDownModule
  ]
})
export class DemoNgZorroAntdModule {}
