const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

const replacements = [
    { from: /AlgoNova/g, to: 'AlgoNova' },
    { from: /algonova/g, to: 'algonova' },
    { from: /ALGONOVA/g, to: 'ALGONOVA' }
];

const ignoreDirs = ['node_modules', '.git', 'dist', 'build', 'public'];
const validExts = ['.js', '.jsx', '.html', '.css', '.md', '.json'];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                processDirectory(fullPath);
            }
        } else {
            const ext = path.extname(fullPath);
            // package.json and config files should also be updated
            if (validExts.includes(ext) || file === 'package.json') {
                let content = fs.readFileSync(fullPath, 'utf8');
                let modified = false;
                
                for (const r of replacements) {
                    if (r.from.test(content)) {
                        content = content.replace(r.from, r.to);
                        modified = true;
                    }
                }
                
                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

processDirectory(rootDir);
console.log('Rebranding complete.');
