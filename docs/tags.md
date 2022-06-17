# Tags

We use tags to match hypothes.is annotations to CIViC Evidence Items.

First we define the **core fields** annotations should cover, these represent the controlled vocabulary fields in a CIViC Evidence Item: gene, variant, drug, disease, and clinical significance.

## Summary of Tag Elements

Tags are not case sensitive. Tags can be composed of several elements, if more than one element is used they are separated with a hyphen character. The order of elements is not important.

| Example    | Format | Usage                                                                                                                                                                                                                                                                              |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| eid:1234   | eid:#  | This is the most important tag element and it is used to indicate which CIViC evidence item this selection is applicable to                                                                                                                                                        |
| status:NEI |        | This is used when a selection, or series of selections, are not sufficient to support the evidence item them are linked to                                                                                                                                                         |
| ex:2       | ex:#   | This is used when there are multiple redundant selections and you want to split them into multiple examples in the final data set. This is useful for telling the users of the dataset that these selections are both considered support (by themselves) for a given evidence item |
| statement  |        | This is used when the selection does not apply to any of the core elements in a CIViC entry but rather is used in supporting the free-text evidence statement (description) field.                                                                                                 |

## Example Tags

The following are examples of tags that might be used

| Example                  | Equivalent Notation      | When to Use                                                                                                                                                                               |
| ------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| eid:1234                 | eid:1234-ex:1            | This is the simplest type of tag and is used for the first example for any evidence item                                                                                                  |
| eid:1234-ex:2            |                          | This indicates this is the second example for some evidence item and is generally only used after the first example (with or without the ex:# tag) has already been added                 |
| eid:1234-statement       |                          | The selection applies to the evidence statement (description) field of the civic evidence item and does not apply to one of the core fields                                               |
| eid:1234-ex:2-status:NEI | eid:1234-status:NEI-ex:2 | This is a more complex tag and is used when a second example is given but the example selections do not contain sufficient evidence to support the core fields of the civic evidence item |

## Not Enough Information

Sometimes you will want to highlight text for an evidence item in CIViC where some of the relevant content is not accessible. There are a couple of ways this can come up

- The full text of the article is not in PMC and the specific text of interest is not in the abstract on PubMed
- The text is inside a figure and is not selectable
- The text is inside and image-style table and is not selectable
- The supporting evidence is not explicitly stated but rather only shown in images or supplementary information

In all of the above cases it is particularly useful if you add `-status:NEI` to your evidence ID tags. This will add a status of not enough information (NEI) to the tag and will ensure that when this data set is downloaded we know that the text selected alone is not sufficient to infer/support the CIViC Entry.

You should also add a comment to state why the content is insufficient.
