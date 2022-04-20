# SAP Commerce Cloud HAC extension template

That repository allows to set up NodeJS script for HAC front-end content monitoring and reloading SAP Commerce context.

## Pre-requisites

If you use tanuki-wrapper in project, system should automatically reload tomcat after build, so no need to do any changes.
Personally due to Mac M1 I cut-out tanuki and using vanilla tomcat. To allow default Tomcat reloading it is required to modify context, which is in hybris auto-generated. It is possible to customize `<context>` section by properties:

```properties
hac.tomcat60.context.reloadable=true
```

## Running

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

To run platform in file-scan mode you should copy this template to your extension and run `npm run start`. That is it.

Enjoy!


## Releasing new versions

To release new version of that project use that way:

```bash
npm install -g git-release
release 
```

That will do all for you.