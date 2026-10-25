# Contributing

Keep the tool small and useful for video editors and their clients. Describe the workflow problem before adding a feature.

1. Open an issue with a fictional example of the problem.
2. Make a focused change. Keep note content in the browser and render it as text, never raw HTML.
3. Run `node --check dist/app.js`, `node check.mjs` and `node check-assets.mjs`.
4. For interface changes, check keyboard navigation, small screens, and the copy/download flow in a browser.
5. Explain the behavior change and the checks you actually performed in the pull request.

Do not add trackers, paid services, credentials, client media or cloud uploads without discussion. Do not include real names, private feedback or customer details in issues and screenshots.

The live release is managed separately from this repository. A merged pull request is not proof that a change is deployed.
