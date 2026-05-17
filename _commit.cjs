const cp = require('child_process');
cp.execSync('git add -A', { cwd: 'D:\\Projects\\cognitive-stack', encoding: 'utf8' });
const result = cp.execSync('git commit -m "feat: Cognitive Organism v1.0.0 -- nine-system architecture, full README overhaul, master spec, calibration dataset, NIGHTSHIFT v3.0 docs"', { cwd: 'D:\\Projects\\cognitive-stack', encoding: 'utf8' });
console.log(result);
const push = cp.execSync('git push origin main', { cwd: 'D:\\Projects\\cognitive-stack', encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
console.log('Push:', push || 'done');
