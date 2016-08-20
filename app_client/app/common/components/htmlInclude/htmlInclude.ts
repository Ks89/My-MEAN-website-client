import {
    Component, Input, ViewContainerRef, OnInit, ComponentResolver, ViewChild
} from "@angular/core";
import {FORM_DIRECTIVES} from "@angular/common";

@Component({
    selector: 'my-ng-include',
    template: '<div #myNgIncludeContent></div>'
})
export class MyNgInclude implements OnInit {

    @Input('src')
    private templateUrl: string;

    @ViewChild('myNgIncludeContent', { read: ViewContainerRef })
    protected contentTarget: ViewContainerRef;

    constructor(private componentResolver: ComponentResolver) {}

    ngOnInit() {
        var dynamicComponent = this.createContentComponent(this.templateUrl);
        this.componentResolver.resolveComponent(dynamicComponent)
            .then((factory: any) => this.contentTarget.createComponent(factory));
    }

    createContentComponent(templateUrl) {
        @Component({
            selector: 'my-ng-include-content',
            templateUrl: templateUrl,
            directives: FORM_DIRECTIVES,
        })
        class MyNgIncludeContent {}
        return MyNgIncludeContent ;
    }
}
