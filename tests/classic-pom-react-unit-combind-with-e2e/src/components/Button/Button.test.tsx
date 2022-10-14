import { Inject, Test, Page, expect } from 'xbell/decorators';
import { ButtonFixture } from './Button.fixture';


@Test()
class ButtonTest {
  @Inject()
  buttonFixture: ButtonFixture;
  @Inject()
  page: Page;

  async trigger_click() {
    const node = this.page.evaluate(async ({ fn }) => {
      const { default: Button } = await import('./Button');
      const React = await import('react');
      const ReactDOM = await import('react-dom');
      const handleClick = fn();
      ReactDOM.render(<Button onClick={handleClick}>nihao</Button>, document.getElementById('root'));
      return handleClick;
    });
    await this.buttonFixture.click();
    expect(await node).toBeCalled()
  }
}