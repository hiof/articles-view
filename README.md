# Article view package

## About

A package with the required files for article views.

## Copyright

This project is distributed under a GNU General Public License v3 - Take a look at the COPYING file for details.

## Install

Install [Git](http://git-scm.com) if it's not already installed on your computer. Then run (this will download this project to the folder the shell has open):

```
$ git clone https://github.com/hiof/articles-view.git
$ git submodule init
```

Install [Node.js](http://nodejs.org) if it's not already installed on your computer. Then run the following inside the project folder(this will install the project dependencies):

```
$ sudo npm install -g grunt-cli
$ npm install
```

## Build

`$ grunt build`: Compiles and builds the articles-view package

## Deploy

1. Rename secret-template.json to secret.json and add your credentials.
2. Deploy and test your code
    1. The staging server for www `$ grunt deploy-staging`
    2. The staging server for www2 `$ grunt deploy-staging2`
3. Deploy to production
    1. Deploy to www `$ grunt deploy-prod`
    2. Deploy to www2 `$ grunt deploy-prod2`

## Releases

[Github releases](https://github.com/hiof/articles-view/releases)

### Roadmap

v1.0.0 - Initial article view
