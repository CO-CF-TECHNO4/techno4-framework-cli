# Techno4 CLI

Techno4 command line utility makes easier to create [Techno4](https://techno4.io) apps. Since Techno4 v4 release, CLI the most recommended way to start Techno4 app development.

## Install

First of all make sure you have globally installed cordova (may require "sudo"):

```
$ npm install -g cordova
```

Then install techno4-cli (may require "sudo"):

```
$ npm install -g techno4-cli
```

## Create Techno4 app

To create Techno4 app, run the following command in the directory where you want to create app:

```
$ techno4 create
```

Program will prompt for few questions about framework and template you want to start with.

## Create Techno4 app with user interface

Run the following command in the directory where you want to create app:

```
$ techno4 create --ui
```

It will launch UI where you will be able to configure the project. By default it launches server on `localhost:3001` address. If you want to change the port then use `--port <n>` argument:

```
$ techno4 create --ui --port 8080
```

## Generate assets

In created project there is an `assets-src` directory. It contains required icons and splash screens source images. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
$ techno4 assets
```

That is all, script will generate all required sizes of icons and splash screens and place them automatically where they need to be.

## Generate assets with user interface

Run the following command in the directory with Techno4 project:

```
$ techno4 assets --ui
```

It will launch UI where you will be able to change icons and splash screens. By default it launches server on `localhost:3001` address. If you want to change the port then use `--port <n>` argument:

```
$ techno4 assets --ui --port 8080
```
