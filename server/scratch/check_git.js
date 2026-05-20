const { execSync } = require('child_process');

try {
  console.log('--- Git ls-files (.env) ---');
  try {
    const trackedFiles = execSync('git ls-files', { encoding: 'utf8' });
    const envFiles = trackedFiles.split('\n').filter(f => f.includes('.env'));
    console.log('Tracked .env files:', envFiles);
  } catch (e) {
    console.log('Error listing tracked files:', e.message);
  }

  console.log('\n--- Git status ---');
  try {
    const status = execSync('git status --short', { encoding: 'utf8' });
    console.log(status || 'No modified/untracked files');
  } catch (e) {
    console.log('Error checking git status:', e.message);
  }

  console.log('\n--- Search for credentials in Git history ---');
  try {
    const gitLog = execSync('git log -S "TaWxade9vS90Sbp1" --oneline', { encoding: 'utf8' });
    console.log('Commits containing the database password:\n', gitLog || 'None found in history');
  } catch (e) {
    console.log('Error checking git history:', e.message);
  }

} catch (err) {
  console.error('Script failed:', err.message);
}
