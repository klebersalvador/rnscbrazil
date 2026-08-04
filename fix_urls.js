const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'frontend_new/src/components');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(componentsDir, function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let c = fs.readFileSync(filePath, 'utf8');
    let newC = c.replace(/\$\{'(\/api.*?)'\}/g, "${import.meta.env.VITE_API_URL || ''}$1");
    if (newC !== c) {
      fs.writeFileSync(filePath, newC);
      console.log('Updated', filePath);
    }
  }
});
