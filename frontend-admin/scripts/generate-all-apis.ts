const {execSync} = require('child_process');

execSync('npm run generate-common-api', {stdio: 'inherit'});
execSync('npm run generate-admin-accounts-api', {stdio: 'inherit'});
