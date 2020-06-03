//take in list of objects
//for each object sort by city and then type
// [{name, url, city, type},...] >> [{city:[type:[{name, url}]]}]

var _ = require("lodash")
var fs = require("fs")

let testData = [
    {
    Name:"google",
    Link:"https://google.com",
    City: "ATL",
    Resource: "Bail fund"
    },
    {
        Name:"google2",
        Link:"https://google2.com",
        City: "ATL",
        Resource: "Bail fund"
    },
    {
        Name:"foo",
        Link:"foo.com",
        City: "NYC",
        Resource: "Bail fund"
        },
        {
            Name:"bar",
            Link:"bar.com",
            City: "NYC",
            Resource: "Scanner"
        }
]


const writeMarkdown = (city, details) =>{
    const filepath = `../src/markdown/${city.toLowerCase()}.md`
    var md = 
        `---
        slug: /${city.toLowerCase()}
        title: `

    fs.writeFileSync(filepath, md)
}

sorted = _.mapValues(_.groupBy(testData, "City"), cityList => cityList.map(resource => _.omit(resource, "City")))

for(const city in sorted){
    console.log(sorted[city])
    sorted[city] = _.mapValues(_.groupBy(sorted[city], "Resource"), rList => rList.map(resource => _.omit(resource, "Resource")))

    writeMarkdown(city, sorted[city])

}


