import { Octokit, App } from "https://esm.sh/octokit";

async function some() {
    const octokit = new Octokit({
        auth: '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'
    })
    const owner = 'ranchimall';
    const repo = 'messenger';
    return await octokit.request('GET /repos/{owner}/{repo}', {
        owner,
        repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}
console.log(new Octokit({
    auth: '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'
}))
// console.log(await some())
