import { Compiler, ViewContainerRef } from '@angular/core';
/**
 * ComponentOutlet is a directive to create dynamic component.
 *
 * Example:
 *
 * ```ts
 * @Component({
 *   selector: 'my-app',
 *   templateUrl: `
 *     <div *componentOutlet="templateUrl; context: self; selector:'my-component'"></div>
 *   `,
 *   directives: [ComponentOutlet]
 * })
 * export class AppComponent {
 *   self = this;
 *
 *   templateUrl = `
 *   <div>
 *     <p>Dynamic Component</p>
 *   </div>`;
 * }
 * ```
 *
 * Result:
 *
 * ```html
 * <my-component>
 *    <div>
 *      <p>Dynamic Component</p>
 *    </div>
 * </my-component>
 * ```
 *
 */
export declare class ComponentOutlet {
    private vcRef;
    private compiler;
    private templateUrl;
    private selector;
    private context;
    constructor(vcRef: ViewContainerRef, compiler: Compiler);
    private _createDynamicComponent();
    ngOnChanges(): void;
}
