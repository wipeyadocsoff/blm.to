//take in list of objects
//for each object sort by city and then type
// [{name, url, city, type},...] >> [{city:[type:[{name, url}]]}]

var _ = require("lodash")
var fs = require("fs")
var jsyaml = require("js-yaml")

const getRecords = () => {
    const dir = './redirects'
}

const writeMarkdown = (city, details) =>{
    const filepath = `./src/markdown/${city.toLowerCase()}.md`
    var md = 
    `---\nslug: /${city.toLowerCase()}\ntitle: ${city}\n---\n`
    for(const type in details){
        md = md.concat(`###${type}\n`)
        details[type].map(res => md = md.concat(`-[${res.Name}](${res.Link})\n`))
    }
    
    fs.writeFileSync(filepath, md)
}


function main() {
    const records = getRecords();

    sorted = _.mapValues(_.groupBy(records, "City"), cityList => cityList.map(resource => _.omit(resource, "City")))

    for(const city in sorted){
        sorted[city] = _.mapValues(_.groupBy(sorted[city], "Resource"), rList => rList.map(resource => _.omit(resource, "Resource")))
        writeMarkdown(city, sorted[city])
    }
}


main().catch(err => {
    console.error(err);
});




