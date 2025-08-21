import { execSync } from 'child_process';

execSync('npm run generate-common-api', { stdio: 'inherit' });
execSync('npm run generate-common-system-api', { stdio: 'inherit' });
execSync('npm run generate-dictionaries-api', { stdio: 'inherit' });
execSync('npm run generate-users-api', { stdio: 'inherit' });
execSync('npm run generate-admin-accounts-api', { stdio: 'inherit' });
execSync('npm run generate-admin-users-api', { stdio: 'inherit' });
execSync('npm run generate-admin-reports-api', { stdio: 'inherit' });
execSync('npm run generate-admin-statistics-api', { stdio: 'inherit' });
execSync('npm run generate-admin-transactions-api', { stdio: 'inherit' });
execSync('npm run generate-admin-messages-api', { stdio: 'inherit' });
execSync('npm run generate-admin-errors-api', { stdio: 'inherit' });
execSync('npm run generate-actuator-internal-api', { stdio: 'inherit' });
execSync('npm run generate-actuator-admin-api', { stdio: 'inherit' });
execSync('npm run generate-actuator-external-api', { stdio: 'inherit' });
