# All in one place to securely access FLO blockchain-based DApps from RanchiMall

## How does integrity check work?
There are two parts to how the integrity check works.
- Server-side hash calculation
  * Hash generated for hosted app code. Which uses ```hash``` endpoint from ```https://utility-api.ranchimall.net/``` API.
  * Hash generated from Github repo API.
- Authorized app hashes stored inside ```scripts/dappList.js``` file within this repo.
Both of these hashes need to match to pass the integrity checks.

## How to update the hashes
- Server-side hashes
  * These are updated automatically when the content of any RanchiMall repo changes and uses ***Github webhooks***
- Local hashes
  * To update locally stored hashes you can use `scripts/updateAuthorizedHashes.js` node script.
  ```Javascript
  // To run the updateAuthorizedHashes.js
  // Navigate to scripts folder within dapps repo
  // and run following command in the console
  node updateAuthorizedHashes.js
  //you will require node to installed to run this command
  ```
  * This might take a few minutes. If there is no error, you should get `Updated dappList.js` message in the console.
  * ***Please don't run this command repeatedly as it will encounter Github API rate limit***
