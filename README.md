<img src="./img/reslide-logo-black.png" align="right" title="reSLIDE" />

# reSLIDE
Share and remotely control your PDF-based presentations, all in the browser, without plugins or network restrictions. The process is simple: first you upload a PDF file to the website (no login required). When the upload is complete you receive two URLs: one for the presenter (can change the slides) and another for the viewers (can't change the slides). That's all!

[You can see a demo of reSLIDE working here.](https://reslide.fernandobevilacqua.com)

## How does it work?

reSLIDE uses polling via HTTP (*not* HTTP Long Polling) to synchronize the slides among the presenter and the viewers. The slide change is affected by delay of ~1 second, which is a fair trade off considering no fancy setup is required, e.g. WebSockets, and there is not network restrictions, e.g. presenter and viewer must be in the same network.

The PDF presentations are rendered in the browser by [PDF.js](https://mozilla.github.io/pdf.js/), Mozilla's general-purpose, web standards-based platform for parsing and rendering PDFs.

## Getting started

You need [PHP](http://php.net) and a web server to run reSLIDE. Just clone the [project repository](https://github.com/Dovyski/reslide.git) and point your web server's document root to that folder.

By default, reSLIDE will use a temporary folder provided by the system as a place to store the uploaded presentations. You can specify your own directory by creating a `config.php` file in the root directory of the project.

## License

reSLIDE is licensed under the terms of the [MIT](https://choosealicense.com/licenses/mit/) license and is available for free.

## Changelog

See all changes in the [CHANGELOG](CHANGELOG.md) file.
