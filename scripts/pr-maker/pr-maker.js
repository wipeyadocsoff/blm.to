const process = require('process');
const octonode = require('octonode');
const Airtable = require('airtable');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const GITHUB_API_KEY = process.env.GITHUB_API_KEY;
const PR_USERNAME = process.env.PR_USERNAME;

const github = octonode.client(GITHUB_API_KEY);

const airtable = new Airtable({
    apiKey: AIRTABLE_API_KEY,
}).base('app46oY8u0c5ZBkce');


async function getNewRecords(callback) {
    const newRecords = [];

    return new Promise((succeed, fail) => {
        airtable('BLM Links').select({
            fields: ["Name", "Link", "State", "Resource"],
            filterByFormula: "({PR Link} = '')"
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


async function addPrToRecord(recordID, prLink) {
    return new Promise((succeed, fail) => {
        airtable('BLM Links').update([
            {
                "id": recordID,
                "fields": {
                    "PR Link": prLink
                }
            }
        ], (err, records) => {
            if (err) {
                fail(err);
            } else {
                succeed();
            }
        });
    });
}


async function makePr(slug, url) {
    // unique-ish branch name
    const sanitizedBranch = slug.replace(/[^-a-z0-9_]/i, '-');
    const branchName = `${sanitizedBranch}_${Date.now()}`;

    const repo = github.repo('wipeyadocsoff/blm.to');
    const master = await repo.refAsync('heads/master');

    // create a branch
    await repo.createRefAsync(`refs/heads/${branchName}`, master[0].object.sha);

    // get current file contents
    redirects = await repo.contentsAsync('static/_redirects', branchName);

    // append to contents
    const text = Buffer.from(
        redirects[0]['content'],
        redirects[0]['encoding'],
    ).toString('utf8');

    // check if this already exists
    const duplicate = !! text.match(RegExp(`^/${slug}\\s`, 'm'));

    // commit
    let title = `Link Request: ${slug} -> ${url}`;
    if (duplicate) {
        title = '[DUPLICATE] ' + title;
    }
    await repo.updateContentsAsync(
        'static/_redirects',
        title,
        `${text}\n/${slug} ${url}`,
        redirects[0]['sha'],
        branchName,
    );

    // create pull request
    return await repo.prAsync({
        title,
        body: 'This is an automated pull request.',
        head: `${PR_USERNAME}:${branchName}`,
        base: 'master',
        maintainer_can_modify: true,
    });
}


async function main() {
    const records = await getNewRecords();

    for (const record of records) {
        try {
            const {Id, Name, Link} = record;
            console.log(`Generating Request: ${Name} -> ${Link}`);
            const pr = await makePr(Name, Link);
            await addPrToRecord(Id, pr[0]['html_url']);
        }
        catch (err) {
            console.error(err);
        }
    }
}


main().catch(err => {
    console.error(err);
});
