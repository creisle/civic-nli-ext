# CIViC NLI Chrome Extension

Chrome Extension for viewing Hypothes.is annotations in-line on CIViC Evidence Items for convenience of annotators.

- [Testing the Extension](#testing-the-extension)
- [Get the Hypothes.is Group ID](#get-the-hypothesis-group-id)
- [Get the Hypothes.is API Token](#get-the-hypothesis-api-token)

## Testing the Extension

Clone this repository

```bash
git clone https://github.com/creisle/civic-nli-ext.git
```

Open the extensions page in chrome `chrome://extensions` and enable developer mode. This will allow you to load the extension

![dev mode](./images/chrome-dev-mode.png)

Next load the extension unpacked

![load unpacked](./images/chrome-load-unpacked.png)

Select the `src` folder of this repository. You should now see a new extension at the top of the page

![new ext](./images/chrome-new-ext.png)

Click on the extension icon to input your hypothes.is credentials

![ext credentials](./images/ext-credentials.png)

Now, navigate to the evidence summary page of a CIViC Evidence Item with known annotations. The extension will now display the annotations on the page

![display](./images/civic-nli-annotations.png)

## Get the Hypothes.is Group ID

You can find the relevant group ID by navigating to the group overview page in Hypothesis

![hyp group ID](./images/hyp-group-id.png)

## Get the Hypothes.is API Token

To find your API token, go to the developers page in Hypothes.is

![developers page](./images/hyp-developer.png)

Generate (or use existing if you have already generated it) and copy the API token

![token](./images/hyp-token.png)
