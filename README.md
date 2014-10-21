zombese [![Build Status](https://travis-ci.org/inetCatapult/zombese.svg)](https://travis-ci.org/inetCatapult/zombese)
=======

A WebRTC extension for Zombie.js.

## Extending the Browser API

`zombie` provides an [extension API][zombie-ext] that allows all new `Browser`
objects to be augmented with additional functionality. Using this approach,
`zombese` will create a mocked WebRTC API in all new windows.

```
	var Browser = require("zombie");
	var zombese = require("zombese");
	var browser;
	
	Browser.extend(zombese());
	browser = new Browser();
```
