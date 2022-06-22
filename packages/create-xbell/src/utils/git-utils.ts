import { execSync } from 'child_process';

interface GitConfig {
  userName: string;
  userEmail: string;
}

export function getGitConfig(): GitConfig {
  try {
    const userName = execSync('git config --get user.name').toString('utf-8').trim();
    const userEmail = execSync('git config --get user.email').toString('utf-8').trim();
    return {
      userName,
      userEmail
    };
  } catch(_) {
    return {
      userName: '',
      userEmail: '',
    };
  }
}
