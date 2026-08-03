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
    
    // Replace fetch('/api...') with fetch(`${import.meta.env.VITE_API_URL || ''}/api...`)
    if (content.match(/fetch\('\/api/)) {
        content = content.replace(/fetch\('\/api([^']+)'/g, "fetch(`${import.meta.env.VITE_API_URL || ''}/api$1`");
        changed = true;
    }
    
    // Replace fetch(`/api...`) with fetch(`${import.meta.env.VITE_API_URL || ''}/api...`)
    if (content.match(/fetch\(`\/api/)) {
        content = content.replace(/fetch\(`\/api([^`]+)`/g, "fetch(`${import.meta.env.VITE_API_URL || ''}/api$1`");
        changed = true;
    }
    
    if(changed){
        fs.writeFileSync(file, content);
        console.log('Migrated React: ' + file);
    }
});
