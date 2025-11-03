import { execSync } from 'child_process';

execSync('cd ./projects/shared-modules && npm run generate-common-api', { stdio: 'inherit' });
execSync('cd ./projects/shared-modules && npm run generate-common-system-api', { stdio: 'inherit' });

execSync('cd ./projects/frontend-client && npm run generate-common-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-common-system-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-users-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-tickets-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-accounts-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-dictionaries-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-rates-api', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run generate-reports-api', { stdio: 'inherit' });


execSync('cd ./projects/frontend-admin && npm run generate-common-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-common-system-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-dictionaries-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-users-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-accounts-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-users-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-reports-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-statistics-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-transactions-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-messages-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-errors-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-actuator-internal-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-actuator-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-actuator-external-api', {stdio: 'inherit'});
execSync('cd ./projects/frontend-admin && npm run generate-admin-properties-api', {stdio: 'inherit'});
