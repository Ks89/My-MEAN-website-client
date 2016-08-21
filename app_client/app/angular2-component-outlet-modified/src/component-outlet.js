"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
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
var ComponentOutlet = (function () {
    function ComponentOutlet(vcRef, compiler) {
        this.vcRef = vcRef;
        this.compiler = compiler;
    }
    ComponentOutlet.prototype._createDynamicComponent = function () {
        this.context = this.context || {};
        var metadata = new core_1.ComponentMetadata({
            selector: this.selector,
            templateUrl: this.templateUrl,
        });
        var cmpClass = (function () {
            function _() {
            }
            return _;
        }());
        cmpClass.prototype = this.context;
        return core_1.Component(metadata)(cmpClass);
    };
    ComponentOutlet.prototype.ngOnChanges = function () {
        var _this = this;
        if (!this.templateUrl)
            return;
        this.compiler.compileComponentAsync(this._createDynamicComponent())
            .then(function (factory) {
            var injector = core_1.ReflectiveInjector.fromResolvedProviders([], _this.vcRef.parentInjector);
            _this.vcRef.clear();
            _this.vcRef.createComponent(factory, 0, injector);
        });
    };
    __decorate([
        core_1.Input('componentOutlet'), 
        __metadata('design:type', String)
    ], ComponentOutlet.prototype, "templateUrl", void 0);
    __decorate([
        core_1.Input('componentOutletSelector'), 
        __metadata('design:type', String)
    ], ComponentOutlet.prototype, "selector", void 0);
    __decorate([
        core_1.Input('componentOutletContext'), 
        __metadata('design:type', Object)
    ], ComponentOutlet.prototype, "context", void 0);
    ComponentOutlet = __decorate([
        core_1.Directive({
            selector: '[componentOutlet]',
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.Compiler])
    ], ComponentOutlet);
    return ComponentOutlet;
}());
exports.ComponentOutlet = ComponentOutlet;
