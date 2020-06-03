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


async function makePr(rawSlug, url) {
    // unique-ish branch name
    const slug = rawSlug.replace(/[^-a-z0-9]+/ig, '-');
    const branchName = `link_req_${slug}_${Date.now()}`;

    const repo = github.repo(`${PR_USERNAME}/blm.to`);
    const master = await repo.refAsync('heads/master');

    // create a branch
    await repo.createRefAsync(`refs/heads/${branchName}`, master[0].object.sha);

    // check if it exists already
    const filename = `redirects/${slug}`;
    let existing = null;
    try {
        existing = await repo.contentsAsync(filename, branchName);
    } catch (err) {
        if (err.statusCode !== 404) {
            throw err;
        }
    }

    // create a new file
    const dupeTag = existing ? '[DUPLICATE] ' : '';
    const title = `${dupeTag}Link Request: ${slug} -> ${url}`;
    const content = `/${slug}    ${url}\n`;
    if (existing) {
        await repo.updateContentsAsync(
            filename, title, content, existing[0]['sha'], branchName);
    } else {
        await repo.createContentsAsync(
            filename, title, content, branchName);
    }

    // create pull request
    return await repo.prAsync({
        title,
        body: [
            'This is an automated message.', '',
            'A request has been submitted to shorten:',
            `${url} to https://blm.to/${slug}`,
        ].join('\n'),
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
