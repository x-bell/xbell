import { Fixture, Inject } from 'xbell/decorators';
import { ButtonFixture } from '../components/Button/Button.test.fixture';

// const feature = defineFixture(ButtonFixture);


@Fixture()
export class HomepageFixture {

  @Inject()
  private buttonFixture: ButtonFixture;

  async click() {
    return this.buttonFixture.click();
  }
}
