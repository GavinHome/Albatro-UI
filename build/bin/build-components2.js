
const Components = require('../../packages/components.json');

//vue-cli-service build --target wc --dest lib --name foo-hello packages/**/index.js

Object.keys(Components).forEach(key => {
    console.log(`[build] ${key}`);
    const name = `al-${key}`
    const path = `${Components[key]}`
    exec(`vue-cli-service build --target wc --dest lib2 --no-clean --name ${name} ${path}`);
});

function exec(cmd) {
    return require('child_process').execSync(cmd).toString().trim();
}