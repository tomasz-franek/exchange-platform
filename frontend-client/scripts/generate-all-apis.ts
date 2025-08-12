import { execSync } from 'child_process';

execSync('npm run generate-common-api', { stdio: 'inherit' });
execSync('npm run generate-common-system-api', { stdio: 'inherit' });
execSync('npm run generate-users-api', { stdio: 'inherit' });
execSync('npm run generate-tickets-api', { stdio: 'inherit' });
execSync('npm run generate-accounts-api', { stdio: 'inherit' });
execSync('npm run generate-dictionaries-api', { stdio: 'inherit' });
execSync('npm run generate-rates-api', { stdio: 'inherit' });
execSync('npm run generate-reports-api', { stdio: 'inherit' });
