const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if(file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('frontend_new/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Replace hardcoded localhost
    if(content.includes('http://localhost:8000')) {
        content = content.replace(/http:\/\/localhost:8000/g, 'https://torneiodesinuca.com.br/rnscbrazil/backend_php/public');
        changed = true;
    }
    
    // Replace fetch('/api...')
    if (content.includes("fetch('/api")) {
        content = content.replace(/fetch\('(\/api[^']+)'/g, "fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public${'$1'}`");
        changed = true;
    }
    
    // Replace fetch(`/api...`)
    if (content.includes("fetch(`/api")) {
        content = content.replace(/fetch\(`(\/api[^`]+)`/g, "fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public$1`");
        changed = true;
    }
    
    if(changed){
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
