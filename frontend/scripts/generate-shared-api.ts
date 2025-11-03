import { execSync } from 'child_process';

execSync('cd ./projects/shared-modules && npm run generate-common-api', { stdio: 'inherit' });
execSync('cd ./projects/shared-modules && npm run generate-common-system-api', { stdio: 'inherit' });
