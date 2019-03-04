# API Utilities

This folder contains utilities required to validate and prime OpenAPI definition files before presenting them to the API Gateway.  The utilities include:

* `AWS-Swagger-Tools.json` which is a Postman project file than can be used to Validate, Mock and Tag the OpenAPI definition files before presenting to the AWS Gateway.

# Introduce changelog.md under integration-deploy-utilities

We are introducing a [CHANGELOG.md](https://github.dxc.com/Platform-DXC/release-pipeline/blob/9946c380f386c742af5ce4b9688d1ea9f99d0e54/docs/CHANGE.md ) under integration-deploy-utilities package in order to look the notable changes have been made between each release (or version).

* The component must provide at the root level of the component zip package a file named `/CHANGELOG.md`.
* Ensure to include the most recent version of the integration-deploy-utilities into the `/CHANGELOG.md`.

# Changes made in integration-deploy-utilities

The Integration Deploy Utilities package is a common package used for deploying all APIs. This release package is not always required to be rebuilt - the deployment coordinator should be aware of changes which would require these steps to be performed.

* Updated integration-api/utilities/release-utility-package.sh by adding a line to include the changelog.md file

  `zip -j ${RELEASE_FILE} track/release/pdxc/integration-deploy-utilities/changelog.md`.
  
* We have used the -j option for the zip command to have the directory ignored and allowing the changelog.md file to be put into the root directory of the zip file i.e, under `integration-deploy-utilities`.

