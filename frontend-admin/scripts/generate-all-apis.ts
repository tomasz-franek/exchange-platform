const {execSync} = require('child_process');

execSync('npm run generate-common-api', {stdio: 'inherit'});
execSync('npm run generate-common-system-api', {stdio: 'inherit'});
execSync('npm run generate-users-api', {stdio: 'inherit'});
execSync('npm run generate-admin-accounts-api', {stdio: 'inherit'});
execSync('npm run generate-admin-users-api', {stdio: 'inherit'});
execSync('npm run generate-admin-reports-api', {stdio: 'inherit'});
execSync('npm run generate-admin-statistics-api', {stdio: 'inherit'});
execSync('npm run generate-admin-transactions-api', {stdio: 'inherit'});
execSync('npm run generate-admin-messages-api', {stdio: 'inherit'});
