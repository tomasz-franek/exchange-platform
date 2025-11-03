import { execSync } from 'child_process';

execSync('cd ./projects/shared-modules && npm run build', { stdio: 'inherit' });
execSync('cd ./projects/frontend-client && npm run build', { stdio: 'inherit' });
execSync('cd ./projects/frontend-admin && npm run build', { stdio: 'inherit' });
