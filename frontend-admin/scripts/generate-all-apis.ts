const { execSync } = require('child_process');

execSync('npm run generate-common-api', {stdio: 'inherit'});
execSync('npm run generate-users-api', {stdio: 'inherit'});
execSync('npm run generate-admin-accounts-api', {stdio: 'inherit'});
execSync('npm run generate-admin-users-api', {stdio: 'inherit'});
