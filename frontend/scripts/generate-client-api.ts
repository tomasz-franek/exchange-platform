import { execSync } from 'child_process';

execSync('cd ./projects/frontend-client && npm run generate-common-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-common-system-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-users-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-tickets-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-accounts-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-dictionaries-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-rates-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-reports-api', { stdio: 'inherit' });
