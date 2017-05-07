import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('is successfully instantiated', () => {
    const app = new AppComponent();
    expect(app instanceof AppComponent).toEqual(true);
  });
});
