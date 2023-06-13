import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('vc', { read: ViewContainerRef }) vc!: ViewContainerRef;
  cacheComponent = new Map<
    'first' | 'second',
    ComponentRef<FirstComponent | SecondComponent>
  >();

  onCheck(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const isChecked = event.target.checked;
      const id = event.target.id as 'first' | 'second';
      this.#onSelectComponent(id, isChecked);
    }
  }

  #onSelectComponent(type: 'first' | 'second', isChecked: boolean): void {
    const dynamicComponentOption: Record<
      'first' | 'second',
      Type<FirstComponent | SecondComponent>
    > = {
      first: FirstComponent,
      second: SecondComponent,
    };
    const component = dynamicComponentOption[type];
    const viewRef = this.cacheComponent.get(type);
    if (!isChecked) {
      this.vc.detach(this.vc.indexOf(viewRef!.hostView));
      return;
    }
    if (!viewRef) {
      const componentRef = this.vc.createComponent(component);
      this.cacheComponent.set(type, componentRef);
      this.vc.insert(componentRef.hostView);
      return;
    }
    this.vc.insert(viewRef.hostView);
  }
}
