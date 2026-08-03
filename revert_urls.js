const fs = require('fs');

// Reverter Angular
const angularFiles = ['html-24-11-2025/main.js', 'html-24-11-2025/scripts.js'];
angularFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api')) {
            content = content.replace(/https:\/\/torneiodesinuca\.com\.br\/rnscbrazil\/backend_php\/public\/api/g, 'http://localhost:1337');
            fs.writeFileSync(file, content);
            console.log(`Reverted Angular: ${file}`);
        }
    }
});

// Reverter React
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

const reactFiles = walk('frontend_new/src');
reactFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('https://torneiodesinuca.com.br/rnscbrazil/backend_php/public')) {
        content = content.replace(/https:\/\/torneiodesinuca\.com\.br\/rnscbrazil\/backend_php\/public/g, '');
        changed = true;
    }
    
    if(changed){
        fs.writeFileSync(file, content);
        console.log('Reverted React: ' + file);
    }
});
