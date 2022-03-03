import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-three-state-button',
  template: `
    <button class='btn btn-primary'
            [type]='type'
            [disabled]='disabled'>
      <ng-container *ngIf='state === "ready"'>
        <ng-content select='[ready]'></ng-content>
      </ng-container>

      <ng-container *ngIf='state === "adding"'>
        <ng-content select='[adding]'></ng-content>
      </ng-container>

      <ng-container *ngIf='state === "done"'>
        <ng-content select='[done]'></ng-content>
      </ng-container>
    </button>
  `
})
export class ThreeStateButtonComponent {
  @Input() state: 'ready' | 'adding' | 'done';
  @Input() type: 'submit' | 'button' = 'submit';
  @Input() disabled: boolean;
}
