const { execSync } = require('child_process');

execSync('npm run generate-common-api', { stdio: 'inherit' });
execSync('npm run generate-tickets-api', { stdio: 'inherit' });
execSync('npm run generate-accounts-api', { stdio: 'inherit' });
execSync('npm run generate-dictionaries-api', { stdio: 'inherit' });
