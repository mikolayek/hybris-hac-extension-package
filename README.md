# SAP Commerce Cloud HAC extension template

That repository allows to set up NodeJS script for HAC front-end content monitoring and reloading SAP Commerce context.

## Pre-requisites

If you use tanuki-wrapper in project, system should automatically reload tomcat after build, so no need to do any changes.
Personally due to Mac M1 I cut-out tanuki and using vanilla tomcat. To allow default Tomcat reloading it is required to modify context, which is in hybris auto-generated. It is possible to customize `<context>` section by properties:

```properties
hac.tomcat60.context.reloadable=true
```

### Extension requirements

Extension should be hac-aware, which is your `extensioninfo.xml` should contain:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<extensioninfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="extensioninfo.xsd">        
    <extension ... >
...        
        <requires-extension name="backoffice"/>
        <meta key="hac-module" value="true"/>
...
    </extension>
</extensioninfo>
```

When you generate extension by `ant extgent` and select template `yhacext` you should already have it, if you create extension manually it is required to add it.

Then section for `hac` should have folder structure `hac/resources/jsp,static`. That folder structure usually is used for additional development.

Details which are required to extension configuration you can find in file `_extensioninfo.xml`.

## Build Process

Build process can be done from two sides: NPM or ANT. For Java developers, it is more convenient to use `ant` instead `npm`.
You can update `buildcallbacks.xml` using included file `_buildcallbacks.xml`. That gives you possibility to append to `build` (and `clean`) tasks webpack builds.

To run platform build from `npm` you can do from folder `/hac/resources`. there you can run 

```bash
# building JS classes
npm run build
# cleaning environment
npm run clean
# running just bare-bones web components
npm run watch
# running hybris platform with web components in watch mode
npm run wa
```

## Running
To run platform in file-scan mode you should copy this template to your extension and run `npm run start`. That is it.

Enjoy!

## HAC Web Development
`hac` folder contains html and JS code which will be applied to hac application. That part of code also should support modern ways of using npm packages and building pages. That is why that folder follows structure from [Static Website Template][1] from GitHub.

## Releasing new versions

To release new version of that project use that way:

```bash
npm install -g git-release
release 
```

That will do all for you.

## References

* [yhac @SAP Help][2]
* [Adding Functionality to Administration Console]
* [Static Website Template - Vincenius@GitHub][1]

[1]: https://github.com/wwebdev/static-website-template
[2]: https://help.sap.com/docs/SAP_COMMERCE/d0224eca81e249cb821f2cdf45a82ace/7854961470a64894af76b8f424c302af.html?locale=en-US&q=yhacext
[3]: https://help.sap.com/docs/SAP_COMMERCE/5c9ea0c629214e42b727bf08800d8dfa/df4994dfb4464ede8ffe61366c9cff5b.html?locale=en-US