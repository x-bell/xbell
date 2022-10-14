import { HomepageFixture } from '../src/views/Homepage/Homepage.fixture';
import { Test, Inject,  } from 'xbell/decorators';
import { Page, Project } from 'xbell';

@Test()
class HomepageE2ETest {
  @Inject()
  page: Page;

  @Inject()
  project: Project

  async open_page() {
    await this.page.goto(this.project.data.origin);
  }
}

