const fs = require('fs');
const files = [
  'frontend_new/src/components/LandingPage.jsx',
  'frontend_new/src/components/Dashboard.jsx',
  'frontend_new/src/components/Registro.jsx',
  'frontend_new/src/components/ResultadosAntigos.jsx',
  'frontend_new/src/components/Login.jsx'
];
files.forEach(file => {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Quick and dirty manual replacement for these specific files that had dynamic URLs
    if (content.includes("fetch(`${'/api")) {
        content = content.replace(/fetch\(`\$\{'\/api/g, "fetch(`${import.meta.env.VITE_API_URL || ''}/api");
        changed = true;
    }
    
    if (content.includes("fetch('/api")) {
        content = content.replace(/fetch\('\/api/g, "fetch(`${import.meta.env.VITE_API_URL || ''}/api");
        // Fix trailing quotes that might have been broken by this naive replace
        content = content.replace(/\/api([^']*)'/g, "/api$1`");
        changed = true;
    }

    if(changed){
        fs.writeFileSync(file, content);
        console.log('Migrated React (fallback): ' + file);
    }
});
