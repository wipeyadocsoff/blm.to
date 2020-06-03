//take in list of objects
//for each object sort by city and then type
// [{name, url, city, type},...] >> [{city:[type:[{name, url}]]}]

var _ = require("lodash")
var fs = require("fs")

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;


const airtable = new Airtable({
    apiKey: AIRTABLE_API_KEY,
}).base('app46oY8u0c5ZBkce');


async function getAllRecords(callback) {
    const newRecords = [];

    return new Promise((succeed, fail) => {
        airtable('BLM Links').select({
            fields: ["Name", "Link", "State", "Resource"]
            //filterByFormula: "({PR Link} = '')"
        }).eachPage((records, fetchNextPage) => {
            // This function will get called for each page of records.
            records.map(record => newRecords.push({
                Id: record.id,
                Name: record.fields.Name,
                Link: record.fields.Link,
                State: record.fields.State,
                Resource: record.fields.Resource
            }));
            fetchNextPage();
        }, function done(err) {
            if (err) {
                fail(err);
            } else {
                succeed(newRecords);
            }
        });
    });
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


async function main() {
    const records = await getAllRecords();

    sorted = _.mapValues(_.groupBy(records, "City"), cityList => cityList.map(resource => _.omit(resource, "City")))

    for(const city in sorted){
        sorted[city] = _.mapValues(_.groupBy(sorted[city], "Resource"), rList => rList.map(resource => _.omit(resource, "Resource")))
        writeMarkdown(city, sorted[city])
    }
}


main().catch(err => {
    console.error(err);
});




