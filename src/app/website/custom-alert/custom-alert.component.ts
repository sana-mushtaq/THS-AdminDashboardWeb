import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})
export class CustomAlertComponent implements OnInit {

  ngOnInit(){}

  @Input() title: string
  @Input() message: string
  @Input() showCancel: boolean = true
  @Input() showConfirm: boolean = true
  @Input() cancelButtonText: string = 'Cancel'
  @Input() continueButtonText: string = 'Continue'

  @Output() cancelClick = new EventEmitter<void>()
  @Output() continueClick = new EventEmitter<void>()

  onCancelClick(): void {

      this.cancelClick.emit();

    }

  onContinueClick(): void {

    this.continueClick.emit();

  }

}
