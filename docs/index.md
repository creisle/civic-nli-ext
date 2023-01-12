# Home

The CIViC natural language interpretation (NLI) project will create a fact-checking companion data set for [CIViC](https://civicdb.org/). The aim of this project is to annotate relevant sections of the full-text of articles that are used to support evidence items in the Clinical Interpretation of Variants in Cancer database ([CIViC](https://civicdb.org/)). This will create a novel high-quality oncology-focused data set for natural language inference (NLI). he particular sentences/spans in the text which should be selected are those that are sufficient and required to ensure the article does indeed contain/support the CIViC entry.

## Getting Started

This project uses chrome extensions to help annotators collect data through a web service called hypothes.is, therefore you will need the following

- access to google chrome
- sign up for a [hypothes.is](https://web.hypothes.is) account
- install the [hypothes.is chrome extension](https://chrome.google.com/webstore/detail/hypothesis-web-pdf-annota/bjfhmglciegochdpefhhlphglcehbmek?hl=en)
- install the [CIViC-NLI chrome extension](https://chrome.google.com/webstore/detail/civic-nli/ibjaklbaahlokfkilllodngidgmjojfl)

Once you have all the following set up, message the project lead to get the hypothes.is annotation group URL to join the private annotation group.

See the examples in the left-hand side bar to get started.

If you are already a CIViC curator, the simplest way to get started is to annotate the last paper you entered into CIViC.

## The Basics

When selecting supporting sentences/text keep in mind that any given line of support for an evidence item should be minimal and sufficient. Pick the best support from the paper for that particular evidence item. The selected text in theory should be the only parts of the paper the civic reviewer would need to look at in order to review that the evidence item is indeed supported by that paper.

Our end goal is a dataset where we have 1 or more examples of text that supports a given CIViC evidence item. This text should stand on its own and should cover all of the core elements

- Gene
- Variant
- Disease
- Drug/Therapy
- Clinical Significance
- Phenotype

Try not to select more than you need but still make sure to keep complete sentences. It is important to select text which discussed the current manuscript and not background/introductory text referencing other works
