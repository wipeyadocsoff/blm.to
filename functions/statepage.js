//take in list of objects
//for each object sort by state and then type
// [{name, url, state, type},...] >> [{state:[type:[{name, url}]]}]

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
                    resolveRecords(records)
                    return
                }
            })
        })
    })
}

const writeMarkdown = (state, details) =>{
    if(state == 'null'){
        state = 'misc'
    }
    const filepath = `./src/markdown/${state.toLowerCase()}.md`
    var md = 
    `---\nslug: /${state.toLowerCase()}\ntitle: ${state}\n---\n`
    for(const type in details){
        md = md.concat(`###${type}\n`)
        details[type].map(res => md = md.concat(`- [${res.Name}](${res.Link})\n`))
    }
    
    fs.writeFileSync(filepath, md)
}


async function main() {
    try{
        const records = await getRecords()
        sorted = _.mapValues(_.groupBy(records, "State"), stateList => stateList.map(resource => _.omit(resource, "State")))

        for(const state in sorted){
            sorted[state] = _.mapValues(_.groupBy(sorted[state], "Resource"), rList => rList.map(resource => _.omit(resource, "Resource")))
            writeMarkdown(state, sorted[state])
        }
    } catch (e){
        console.error(e)
    }
}


main().catch(e =>{
    console.error(e)
})




