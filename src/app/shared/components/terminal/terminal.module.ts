import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal.component';
import { NgTerminalModule } from 'ng-terminal';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SafeValueModule } from '../../pipes/safe-value/safe-value.module';


@NgModule({
  declarations: [
    TerminalComponent
  ],
  imports: [
    CommonModule,
    NgTerminalModule,
    FlexLayoutModule,
    SafeValueModule
  ],
  exports: [TerminalComponent]
})
export class TerminalModule { }
