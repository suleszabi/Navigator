# Navigator

Navigator is a JavaScript class, which allows to create "single page websites". So the webpage have to load only once, after that the content will changed by DOM manipulation.

Navigator also handle the page title and the browser history when the page changing the content. So the browser's back and forward buttons are able to use.

# Demo version

Demo version's sources can be found in the Demo folder

Demo version is also able to try with
[this link](https://sk-studio.hu/Navigator)
.

# How it works

## Server

It works on HTTP webservers. It need a special configuration (``.htaccess``): all requests have to be redirect to the main page (mostly index.html).

Main page is the web page's frame. It has a div with mainContainer id. Navigator class will be handle this div's content with DOM manipulation.

## location.json

Main cointaner's possible contents are in the html folder in separate text files. Every content hase a separate file. These files are includes HTML texts, which can be a content of the main container.

Datas of possible contents need to be collected to a json file. There is an object in this file with subobject. Every key is the url part of the possible content, and every key have a subobject with 3 data: ``path``, ``position``, ``titleAddition``.

### path

The path of the HTML text content, which will be loaded to the main container.

### position

When the content ready, Navigator class can scroll to a specified position. The value can be "top" and the id name of an element where we want to scroll.

### titleAddition

When the class load a new content, it can be change the page title too. This titleAddition will be added to the brandname of the page. If this not need, it can be an empty string.

## Navigator class instantiation

Constructor has 6 arguments. These in a row:
* ``brand`` – The brand name or main title of the page.
* ``locationsJsonPath`` – The path of location.json file.
* ``mainPageUrl`` – The uniqe url part of the main page. For example: domain.com/main
* ``extraURL`` – If the webpage is in a subroot of the host, it need to specified the subroot with this.
* ``navbarElement`` – Bootstrap only. DOM object of the Bootstrap navbar.
* ``navbarToggle`` – Bootstrap only. DOM object of the navbar toggle button

## Special HTML items

### General hyperlink <a>

If the user click on a hyperlink, the page will not reload. Navigator class will grab the value of href attribute and search it in the locations.json. If it found it, it load the chosen content to the main container, if not, it load the main page.

### Non link referer

We can make any html elements to a referer with use a non-link-referer class and refer-to attribute.

```html
<p class="non-link-referer" refer-to="target">Paragraph text<p>
```

### New page opener

If need a referer which open an url in new page, we can use this item. Any html elements can be a „new page opener" with use a new-page-opener class and open-url attribute.

```html
<p class="new-page-opener" open-url="https://google.com">Open Google at new page!</p>
```