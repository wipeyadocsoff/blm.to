const fs = require('fs');
const path = require('path');
const YAML = require('yaml');


function allRedirects() {
    const root = path.join(__dirname, '../redirects/');
    const files = fs.readdirSync(root);
    return files.map(file => {
        const text = fs.readFileSync(path.join(root, file), 'utf8');
        const data = YAML.parse(text);
        return `/${data.Name}   ${data.Link}`;
    });
}

function main() {
    const target = path.join(__dirname, '../static/_redirects');
    fs.writeFileSync(target, allRedirects().join('\n'));
}

main();
