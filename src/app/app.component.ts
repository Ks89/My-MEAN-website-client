import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mmw-application',
  styleUrls: ['app.scss'],
  templateUrl: 'app.html'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.addLangs(["en", "it"]);
    translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|it/) ? browserLang : 'en');
  }
}
