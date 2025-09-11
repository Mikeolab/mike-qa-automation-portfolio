[Stylelint Ignore Code](https://stylelint.io/user-guide/ignore-code/)


**When disabling stylelint, we HAVE to include the rule we're disabling and a comment about the rule:**

If we do not follow this practice the sites styles will not compile until you fix these comments.

```
/* stylelint-disable-next-line declaration-no-important -- With comment after two hyphens here... */


**Example with multiple properties:**
Multiple properties are comma separated, this is the same for the single line comments.
```
/* stylelint-disable declaration-no-important, declaration-no-important -- With comment after two hyphens here... */
	.replace-me-with-disabled-style {...}
/* stylelint-enable */
```