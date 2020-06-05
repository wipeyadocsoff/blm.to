//take in list of objects
//for each object sort by city and then type
// [{name, url, city, type},...] >> [{city:[type:[{name, url}]]}]

var _ = require("lodash")
var fs = require("fs")
var yaml = require("js-yaml")

const getRecords = async () => {
    const dirname = './redirects'
    let records = []
    return new Promise((resolveRecords, rejectRecords) => {
        fs.readdir(dirname, function(err, filenames) {
            filenames.forEach(function(filename, idx) {
                let fileContents = fs.readFileSync(`./redirects/${filename}`, 'utf8')
                let data = yaml.safeLoad(fileContents)
                records.push(data)
                if (idx === filenames.length -1){
                    console.log(records)
                    resolveRecords(records)
                    return
                }
            })
        })
    })
}

const writeMarkdown = (city, details) =>{
    if(city == 'null'){
        city = 'misc'
    }
    const filepath = `./src/markdown/${city.toLowerCase()}.md`
    var md = 
    `---\nslug: /${city.toLowerCase()}\ntitle: ${city}\n---\n`
    for(const type in details){
        md = md.concat(`###${type}\n`)
        details[type].map(res => md = md.concat(`-[${res.Name}](${res.Link})\n`))
    }
    
    fs.writeFileSync(filepath, md)
}


async function main() {
    try{
        const records = await getRecords()
        sorted = _.mapValues(_.groupBy(records, "State"), cityList => cityList.map(resource => _.omit(resource, "State")))

        for(const city in sorted){
            sorted[city] = _.mapValues(_.groupBy(sorted[city], "Resource"), rList => rList.map(resource => _.omit(resource, "Resource")))
            writeMarkdown(city, sorted[city])
        }
    } catch (e){
        console.error(e)
    }
}


main().catch(e =>{
    console.error(e)
})




