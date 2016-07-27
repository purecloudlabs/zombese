zombese [![Build Status](https://travis-ci.org/bandwidthcom/zombese.svg?branch=master)](https://travis-ci.org/bandwidthcom/zombese)
=======
Part of [Bandwidth Open Source](http://bandwidth.com/?utm_medium=social&utm_source=github&utm_campaign=dtolb&utm_content=_)

A WebRTC extension for [Zombie.js](https://github.com/assaf/zombie).

Zombese is only intended to cover the happy path for setting up a WebRTC connection between two clients running in ```Zombie.js```. Because of this, only orchestration-related parts of the WebRTC API are implemented. Things like the ```MediaStream``` API are not implemented.

## Zombese Dialects

Zombese can be spoken in different dialects. The currently supported dialects of zombese are:

- Firefox (Firefox WebRTC API)

The dialects are exposed in the ```zombese.dialects``` object:
```
{
  default : FirefoxZombeseDialect,
  firefox : FirefoxZombeseDialect
}
```

## Extending the Browser API

`zombie` provides an extension API that allows all new `Browser`
objects to be augmented with additional functionality. Using this approach,
`zombese` will create a mocked WebRTC API in all new windows / tabs.

Without a dialect:

```javascript
var Browser = require("zombie");
var zombese = require("zombese");
var browser;

Browser.extend(zombese());  // uses the default dialect
browser = new Browser();
```

With a dialect:
```javascript
var Browser = require("zombie");
var zombese = require("zombese");
var browser;
	
Browser.extend(zombese(zombese.dialects.firefox));  // uses the firefox dialect
browser = new Browser();
```

The `zombese` function has the following parameters:

- dialect: The dialect to use when teaching a Browser `zombese`
  - optional
  - default: ```zombese.dialects.default```

## License
[MIT License](/LICENSE)
