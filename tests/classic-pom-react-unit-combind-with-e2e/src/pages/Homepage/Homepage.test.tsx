import { Test, Inject, BeforeEach, Project, Page } from 'xbell';
import { HomepageFixture } from './Homepage.fixture';

@Test()
class HomepageUnitTest {
  @Inject()
  fixture: HomepageFixture

  @Inject()
  page: Page;

  @Inject()
  project: Project;

  @BeforeEach()
  async render() {
    await this.page.goto(this.project.data.origin, {
      html: `<div id="root"></div>`
    });

    await this.page.evaluate(async () => {
      const React = await import('react');
      const ReactDOM = await import('react-dom');
      const { default: Homepage } = await import('./Homepage')
      ReactDOM.render(<Homepage />, document.getElementById('root'))
    });
  }

  async open_page() {
    await this.render();
    await this.page.getByText('button')
  }
}

