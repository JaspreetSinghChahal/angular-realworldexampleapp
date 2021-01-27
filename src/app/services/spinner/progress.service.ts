import { ElementRef, Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { timer, Subscription } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { DynamicOverlay } from './dynamic-overlay.service';
import { ProgressSpinnerComponent } from '../../components/common/progress-spinner/progress-spinner.component';

@Injectable()
export class ProgressService {

  constructor(private dynamicOverlay: DynamicOverlay) { }

  public showProgress(elRef: ElementRef) {
    if (elRef) {
      const result: ProgressRef = { subscription: null, overlayRef: null };
      result.subscription = timer(1)
        .subscribe(() => {
          this.dynamicOverlay.setContainerElement(elRef.nativeElement);
          const positionStrategy = this.dynamicOverlay.position().global().centerHorizontally().centerVertically();
          result.overlayRef = this.dynamicOverlay.create({
            positionStrategy: positionStrategy,
            hasBackdrop: true
          });
          result.overlayRef.attach(new ComponentPortal(ProgressSpinnerComponent));
        });
      return result;
    } else {
      return null;
    }
  }

  detach(result: ProgressRef) {
    if (result) {
      result.subscription.unsubscribe();
      if (result.overlayRef) {
        result.overlayRef.detach();
      }
    }
  }
}

export declare type ProgressRef = { subscription: Subscription, overlayRef: OverlayRef };