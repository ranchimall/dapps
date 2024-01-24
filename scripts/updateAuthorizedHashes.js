// run with `node updateAuthorizedHashes.js`
// *** WARNING *** : Do not run this script multiple times in a short period of time.
// It will exceed the Github API rate limit and you will have to wait for an hour to run it again.

const fs = require('fs');
const path = require('path');

// Step 1: Read the dappList.js file
const dappListPath = path.join(__dirname, 'dappList.js');
let dappListContent = fs.readFileSync(dappListPath, 'utf-8');

// Step 2: Parse the dappList.js file
const dappList = dappListContent.replace('dappsList =', '');
const dappListJSON = eval(dappList);

// Step 3: Loop through the dappList.js file
Promise.all(dappListJSON.map(async (dapp) => {
    const { repoLink, appLink } = dapp
    const promises = [getRepoHash((repoLink || appLink).split('/').pop())]
    if (appLink) {
        promises.push(getLinkContentHash(appLink));
    }
    const [repoHash, appHash = null] = await Promise.all(promises)
    const update = { repoHash }
    if (appHash) {
        update.appHash = appHash[0].hash
    }
    return {
        ...dapp,
        ...update
    }
})).then(dappListWithHashes => {
    // Step 5: Write the string to the dappList.js file
    const dappListWithHashesString = `dappsList = ${JSON.stringify(dappListWithHashes, null, 2)}`
    fs.writeFileSync(dappListPath, dappListWithHashesString, 'utf-8')
    console.log('Updated dappList.js')
}).catch(e => {
    console.error(e)
})


async function getRepoHash(repoName) {
    if (!repoName) return null;
    try {
        const response = await fetch(`https://api.github.com/repos/ranchimall/${repoName}/contents/`)
        if (!response.ok) {
            if (response.status === 403) {
                console.log('Github API rate limit exceeded. Try again after some time.')
            } else {
                console.log(`Error fetching repo contents for ${repoName}. Status: ${response.status}`)
            }
            return null
        };
        const json = await response.json()
        const combinedSHA = json.reduce((acc, { sha }) => acc + sha, '')
        return await calculateSHA256(new Blob([combinedSHA]))
    } catch (e) {
        console.error(e)
        return null
    }
}

async function calculateSHA256(blob) {
    const buffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * @param { string | []} a single link or array of links 
 */
async function getLinkContentHash(link) {
    try {
        if (!link) return null
        if (!Array.isArray(link))
            link = [link]
        const data = JSON.stringify({ urls: link })
        return await (await fetch('https://utility-api.ranchimall.net/hash', {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: data
        })).json()
    } catch (e) {
        console.error(e)
        return null
    }
}