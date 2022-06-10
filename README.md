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

![dev mode](./docs/images/chrome-dev-mode.png)

Next load the extension unpacked

![load unpacked](./docs/images/chrome-load-unpacked.png)

Select the `src` folder of this repository. You should now see a new extension at the top of the page.

![new ext](./docs/images/chrome-new-ext.png)

To add your credentials, you will need to  click on the extension icon on the top-right of your browser. You can do this from the extensions drop down menu but it is simpler if you pin the extension so that it shows up and then click on it.

![load unpacked](./docs/images/ext-panel.png)

Click on the extension icon to input your hypothes.is credentials

![ext credentials](./docs/images/ext-credentials.png)

Now, navigate to the evidence summary page of a CIViC Evidence Item with known annotations. The extension will now display the annotations on the page

![display](./docs/images/civic-nli-annotations.png)

## Get the Hypothes.is Group ID

You can find the relevant group ID by navigating to the group overview page in Hypothesis

![hyp group ID](./docs/images/hyp-group-id.png)

## Get the Hypothes.is API Token

To find your API token, go to the developers page in Hypothes.is

![developers page](./docs/images/hyp-developer.png)

Generate (or use existing if you have already generated it) and copy the API token

![token](./docs/images/hyp-token.png)
