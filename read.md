# <a href="#top" id="top"></a>API Gateway Deployment Guide

## Purpose

This document provides the steps required to deploy the API Gateway.  This document is intended to be followed by a person knowledgeable of the API Gateway and release pipeline with all relevant access.  It is not intended to cover every troubleshooting scenario or unique deployment condition.

Each process stage should be completed in its entirety before moving to the next stage.

## Table of Contents

* [Stage Definitions](#stages)

**PREPARE**

* [PREPARE: Remove Code Not Releasing](#remove-code)
* [PREPARE: Incorporate Break/Fixes](#break-fix)
* [PREPARE: Validate Any Policy Changes](#validate-policy)
* [PREPARE: Process Outstanding Pull Requests for Coding Changes](#create-pull-request)
* [PREPARE: Update the Changelogs](#verify-changelog)
* [PREPARE: Merge AAS Develop to Master](#dev-to-master)

**DEPLOY**

* [DEPLOY: Create the AAS Release Package & Deploy to DEV](#create-release)
* [DEPLOY: Create the Integration Deploy Utilities Package & Deploy to DEV](#utilities-release)
* [DEPLOY: Create the Integration API Packages & Deploy to DEV](#package-integration-apis)
  * [Tips for Integration API Deployments](#integration-api-tips)
* [DEPLOY: Create the Integrated Test Release Package & Deploy to DEV](#int-test-release)
* [DEPLOY: Create the Workstream API Packages & Deploy to DEV](#package-workstream-apis)
  * [Tips for Workstream API Deployments](#workstream-api-tips)

**VALIDATE**

* [VALIDATE: Verify Integrated Test Results](#verify-tests)
* [VALIDATE: Run Sanity Tests](#sanity-test)

**PROMOTE**

* [PROMOTE: Get Approval to Mark Stable](#get-approval)
* [PROMOTE: Mark the AAS Package Stable](#mark-aas-stable)
* [PROMOTE: Mark the Integration Deploy Utilities Package Stable](#utilities-stable)
* [PROMOTE: Mark the Integration APIs Stable](#mark-int-api-stable)
* [PROMOTE: Mark the Integrated Test Package Stable](#mark-int-test-stable)
* [PROMOTE: Mark the Workstream APIs Stable](#mark-ws-api-stable)
* [PROMOTE: Review DEV2 Pipeline Execution](#review-dev2-pipeline)
* [PROMOTE: Review TEST Pipeline Execution](#review-test-pipeline)
* [PROMOTE: Review STAGE Pipeline Execution](#review-stage-pipeline)
* [PROMOTE: Review PROD Pipeline Execution](#review-prod-pipeline)

**POST-DEPLOY**

* [POST-DEPLOY: Update Testing Metrics](#update-metrics)

## <a href="#stages" id="stages"></a>Stage Definitions

Each step is tied to a stage in the process.  

|Stage| Definition of Done|
|---|---|
|PREPARE| All required files are submitted in a Pull Request to GitHub.  The Pull Request has been merged. |
|DEPLOY|The Release/ZIP file is created and present in Artifactory. The package has been successfully deployed to DEV. |
|VALIDATE|Test package execution in DEV is validated.  Any smoke test or additional release testing is completed successfully. |
|PROMOTE|The package has been promoted outside of DEV. |
|POST-DEPLOY| These tasks can be completed after the packages have been promoted outside the DEV environment. They are independent of any packaging.|

[Top](#top)

## <a href="#remove-code" id="remove-code"></a>PREPARE: Remove Code Not Releasing

Determine if there is any code that has been merged into GitHub which has not been approved for inclusion in the current package.

Create pull requests as required to back out unwanted changes.

[Top](#top)

## <a href="break-fix" id="break-fix"></a> PREPARE: Incorporate Break/Fixes

Review the code included in the upcoming package scope and verify that all testing is complete and any break/fix changes have been performed, tested, and merged.

[Top](#top)

## <a href="#validate-policy" id="validate-policy"></a>PREPARE: Validate Any Policy Changes

Compare the `infGatewayExecute` and `infGatewayInvoke` IAM _roles_ between sandbox and DEV and determine if there are any differences.

Compare the `infGatewayExecute`, `infGatewayInvoke`, and `inf-gateway-init` IAM _policies_ between Sandbox and DEV and determine if there are any differences.

For any differences identified, determine what project made the changes.  If these changes are required for functionality in this release submit a pull request to [infra-core](https://github.dxc.com/Platform-DXC/infra-core) to have the changes applied in DEV and the higher environments.

[Top](#top)

## <a href="#create-pull-request" id="create-pull-request"></a>PREPARE: Process Outstanding Pull Requests for Coding Changes

All code changes related to the release need to be completed and with their pull requests **approved and merged** in the [`integration-aas/develop`](https://github.dxc.com/Platform-DXC/integration-aas/tree/develop) and [`integration-api/master`](https://github.dxc.com/Platform-DXC/integration-api/tree/master) branches of GitHub.  Create a pull request for any code which still needs to be added to the release and notify the approver that there are still outstanding items.

Review all open pull requests in the repositories to ensure all necessary items have been approved.

Verify in Jenkins that the merge requests process without errors.  Check the results shown on the Pull Request items, and also check in the "Commits" for the `develop` branch (AAS) and `master` branch (API) to make sure the merge completed successfully.  Note that the merge commits can sometimes take a long time (1-2 hours) to complete.

>NOTE: **ALL** outstanding merges must be completed before the next step is performed.

[Top](#top)

## <a href="#verify-changelog" id="verify-changelog"></a>PREPARE: Update the Changelogs

Before creating the **AAS Release Package**, view the contents of the [AAS CHANGELOG.md](https://github.dxc.com/Platform-DXC/integration-aas/blob/master/CHANGELOG.md) to ensure the release number you are creating is represented in the file.  This file is required by the release pipeline process.

Before creating the **Integrated Test Release Package**, view the contents of the [Testing CHANGELOG.md](https://github.dxc.com/Platform-DXC/integration-aas/blob/master/testing/CHANGELOG.md) to ensure the release number you are creating is represented in the file.  This file is required by the release pipeline process.

These files should have been updated prior to the end of the sprint, but if you are bumping the version number on the package (e.g. to address minor issues found during earlier deploy steps) you will need to update the version info in this file to include the version number you are packaging.

>NOTE: THE CHANGELOG FILES ARE ONLY UPDATED IN THE MASTER BRANCH

[Top](#top)

## <a href="#dev-to-master" id="dev-to-master"></a>PREPARE: Merge AAS Develop to Master

Create a new pull request in the [integration-aas](https://github.dxc.com/Platform-DXC/integration-aas) repository.  Select `master` as the base, and `develop` as the compare.

Notify the approver to perform a `merge` on the pull request.

Verify the results of the merge and address any errors as required before moving to the next step.

[Top](#top)

## <a href="#create-release" id="create-release"></a>DEPLOY: Create the AAS Release Package and Deploy to DEV

The release and deploy triggers can be combined into a single PR.  This will create the package and deploy it to DEV in a single step.

>NOTE: The trigger files are created directly in the master branch, not the develop branch.

Create a json file with the following naming convention: \<release_version>.json and place it in the [`track/release`](https://github.dxc.com/Platform-DXC/integration-aas/tree/master/track/release) folder in the `integration-aas/master` branch.

Example:  `1.0.24.json`

The file contents are as described below

```json
{
    "release_tag": "1.0.24",
    "tag_name": "1.0.24",
    "target_commitish": "master",
    "name": "Gateway Initialization and Component Packages",
    "description": "integration AAS deploy package",
    "body": "Sprint 4 Release Package",
    "draft": false,
    "prerelease": true,
    "release_file": "1.0.24.zip",
    "integration-deploy": "1.0.5",
    "integration-utility": "1.0.5",
    "integration-swagger": "1.0.5",
    "integration-security": "1.0.1"
}
```

Field definitions:

| Field | Contents |
| --- | --- |
| release_tag | The tag to apply to the release.  This should be the version number. You can see this tag in the [GitHub repository releases](https://github.dxc.com/Platform-DXC/integration-aas/tags) 'tags' view. |
| tag_name | Use the same value from release_tag.|
| target_commitish | The Github repository branch from which the release should be generated.  This should always be 'master'. |
| name | The title of the release.  You can see this name in the [Github repository releases](https://github.dxc.com/Platform-DXC/integration-aas/releases) 'releases' view. |
|description| A short description of the release.|
| body |The full description of the release.  You will see this value in the [Github repository releases](https://github.dxc.com/Platform-DXC/integration-aas/releases) 'releases' view under the name/title. |
| draft | Indicates if the release should be registered as a draft or not (true/false) |
| prerelease | Indicates if the release is final or not (true/false).  Always set this to true when deploying to Dev. **NOTE**: This value will be updated when releasing to Test in a later step. |
| integration-deploy/<br>integration-utility/<br>integration-swagger/<br>integration-security | **ALL** the `integration` APIs should be listed here along with their most recent version numbers. These values are not currently used in any logic but remain here for consistency.  As new integration APIs are introduced, add them to this list. |

Create an md file with the following naming convention: \<environment>\_\<release_version>.md and place it in the [`track/deploy`](https://github.dxc.com/Platform-DXC/integration-aas/tree/master/track/deploy) folder in the `master` branch.

The release file name is the value entered in the `release_file` key-value pair in the release trigger file created in the [prior step](#create-release), minus any file extension.  Use the DEV environment identifier as a prefix. Example:

    Release file `release_file` value:  1.0.24.zip
    Deployment Trigger File Name:  DEV_1.0.24.md

The file does not need to have any content.  It only needs to be present.  Place this file into the [integration-aas/track/deploy/](https://github.dxc.com/Platform-DXC/integration-aas/tree/master/track/deploy) folder.

Create a pull request for the two trigger files and notify the approver to work the request.

Approve then merge the pull request with the trigger files.  This will kick off the auto-deploy activities.

The release package creation is fully automated. When the files described in this section are merged into the `master` branch the package will be built automatically based on the contents of this file, then it will be deployed into the DEV environment.

Verify in Jenkins that the merge and deploy processed successfully. Verify the package as needed in Artifactory.

Address any errors from the Jenkins run before moving to the next step.

[Top](#top)

## <a href="#utilities-release" id="utilities-release"></a>DEPLOY:  Create the Integration Deploy Utilities Package & Deploy to DEV

The Integration Deploy Utilities package is a common package used for deploying all APIs. This release package is not always required to be rebuilt - the deployment coordinator should be aware of changes which would require these steps to be performed.  

If there are changes to the Integration Deploy Utilities package used for API Deployment this step should be performed *before* deploying the APIs.

Create a json file with the following naming convention: integrationDeployUtilities-\<release_version>.json and place it in the [`track/release/pdxc/integration-deploy-utilities`](https://github.dxc.com/Platform-DXC/integration-api/tree/master/track/release/pdxc/integration-deploy-utilities) folder in the `integration-api/master` branch.

Example:  `integrationDeployUtilities_1.0.1.json`

Note that when creating the track/release file there will be no files listed in the `api_bundle` field as shown in the example below.

```json
{
"tag_name": "IntegrationDeployUtilities(1.0.0)",
"target_commitish": "master",
"name": "Integration Deploy Utilities",
"body": "Integration Deploy Utilities for deploy other api packages ",
"draft": false,
"prerelease": true,
"release_file": "integration-deploy-utilities.zip",
"api_name": "integrationDeployUtilities",
"api_bundle": [],
"release_version": "1.0.0",
"isApi": false
} 
```

Note that this file has an extra parameter "isApi".  This field must be provided to bypass the API Catalog check.  If it is not present then the commit will get a Jenkins error.  IntegrationDeployUtilities is the only package where this parameter applies.

Create an md file with the following naming convention:  \<environment>\_integrationDeploy_<release_version>.md and place it in the `integration-api/track/deploy` folder.

Example: `DEV_integrationDeploy_1.0.1.md`

This file does not need to have any content.  It only needs to be present.

Create a pull request for the two files and notify the approver to work the request.

Approve then merge the pull request with the deploy trigger file.  This will create the release package and auto-deploy the package to DEV. Verify in Jenkins that the merge processed successfully before proceeding.  Verify the package in Artifactory as required.

[Top](#top)

## <a href="#package-integration-apis" id="package-integration-apis"></a>DEPLOY: Create the Integration API Packages & Deploy to DEV

It is not typical to have to deploy the integration APIs during a pipeline deployment.  If there are new or updated Integration APIs it is a good practice to validate that all the changes have been deployed as needed.

The deployment coordinator should be aware of changes to the integration code which might require redeployment of workstream APIs and perform appropriate steps at this time.  The information below is given to help with the sequence and decisions once you have determined that the workstream APIs require redeployment.

As needed, create a release package and deploy trigger for each API following the standard instructions to [Create a Release Package](https://github.dxc.com/Platform-DXC/integration-api/blob/master/docs/APIManagementGettingStarted.md#-step-2---create-a-release-package) in the API Management Getting Started Guide.

You can combine the release and deploy triggers into a single PR in the above step.

[Top](#top)

### <a href="#integration-api-tips" id="integration-api-tips"></a> Tips for Integration API Deployments

Each Integration API requires deployment into Dev.  The order of release is important for these APIs in order to ensure the base path names do not change.  The order is:

1. Integration Deploy
2. Integration Swagger
3. Integration Utility
4. Integration Security

You will need to gather the following information for each API to ensure we are pushing the correct version.

* The version in the most recent swagger file and the date it was last modified
* The most recent version in Artifactory, the date it was created, and it's status (stable/unstable)
* The most recent track/release file version number
* The most recent track/deploy file version number

These checks are necessary to ensure we are pushing the most current code into DEV.  The version numbers can get out of sync for various reasons including multiple check-ins of API code with the same version number and manual deployments (bypassing the track/deploy method) by developers.  *This is an identified gap that is under review for correction.*

The flow diagram below shows the evaluation steps for each Integration API to ensure we are pushing the correct version.

![VersionDecision](./_images/API-deployment-decision.png)

This image can be found [here](./_images/API-deployment-decision.png) to be more readable.

Tips on processing any needed changes quickly:

* If you have multiple swagger files to update, they can all be processed in a single PR.
* Do not create a PR for a release or deploy trigger file until the associated swagger file has been merged.
* The most efficient way to process these API file changes in parallel is to process the swaggers first, then you can process all the trigger files last.

>NOTE:  The track/release and track/deploy file can be in a single PR for each API.  The swagger files can be combined into one PR which covers multiple APIs.

[Top](#top)

## <a href="#int-test-release" id="int-test-release"></a>DEPLOY:  Create the Integrated Test Release Package & Deploy to DEV

The Integrated Test package contains automated tests which run in the pipeline.  To create a new package, create a json file in the [integration-aas/track/testrelease](https://github.dxc.com/Platform-DXC/integration-aas/tree/master/track/testrelease) folder in the `master` branch.  The file name convention is \<release_version>.json.

Example:  `1.0.6.json`

Sample file:

```json
{
    "release_tag": "1.0.6",
    "name": "Integration AAS Test Package",
    "description": "Package for testing Integration API components",
    "prerelease": true,
    "release_file": "tests-integration-aas.zip"
}
```

>NOTE:  The release_file name must start with _**tests-**_.

>NOTE: The trigger files are created directly in the master branch, not the develop branch.

Field definitions:

| Field | Contents |
| --- | --- |
| release_tag | The tag to apply to the release.  This should be the version number. You can see this tag in the [GitHub repository releases](https://github.dxc.com/Platform-DXC/integration-aas/tags) 'tags' view. |
| name | The title of the release.  You can see this name in the [Github repository releases](https://github.dxc.com/Platform-DXC/integration-aas/releases) 'releases' view. |
|description| A short description of the release.|
| prerelease | Indicates if the release is final or not (true/false).  Always set this to true when deploying to Dev. **NOTE**: This value will be updated when releasing to Test in a later step.|
|release_file|The name to use for the file release to Artifactory.  Leave the name as `test-integration-aas.zip`.|

Create an md file with the following naming convention: \<environment>\_\<release_version>.md and place it in the [`track/testdeploy`](https://github.dxc.com/Platform-DXC/integration-aas/tree/master/track/testdeploy) folder in the `master` branch.

The release file name is the value entered in the `release_file` key-value pair in the release trigger file created in the [prior step](#int-test-release), minus any file extension.  Use the DEV environment identifier as a prefix. Example:

    Release file `release_file` value:  1.0.6.zip
    Deployment Trigger File Name:  DEV_1.0.6.md

The file does not need to have any content.  It only needs to be present.  Place this file into the [integration-aas/track/testdeploy/](https://github.dxc.com/Platform-DXC/integration-aas/tree/master/track/testdeploy) folder.

Create a pull request for the two files and notify the approver to work the request.

The release package creation is fully automated. When the files described in this section are merged into the `master` branch the package will be built automatically based on the contents of this file, then it will be deployed into the DEV environment.

Verify in Jenkins that the merge and deploy processed successfully. Verify the package as needed in Artifactory.

Address any errors from the Jenkins run before moving to the next step.

[Top](#top)

## <a href="#package-workstream-apis" id="package-workstream-apis"></a>DEPLOY: Create the Workstream API Packages & Deploy to DEV

It is not typical to have to deploy the workstream APIs during a pipeline deployment.  If there are new or updated workstream APIs it is a good practice to validate that all the changes have been deployed as needed.

The deployment coordinator should be aware of changes to the integration code which might require redeployment of workstream APIs and perform appropriate steps at this time.  The information below is given to help with the sequence and decisions once you have determined that the workstream APIs require redeployment.

As needed, create a release package and deploy trigger for each API following the standard instructions to [Create a Release Package](https://github.dxc.com/Platform-DXC/integration-api/blob/master/docs/APIManagementGettingStarted.md#-step-2---create-a-release-package) in the API Management Getting Started Guide.

You can combine the release and deploy triggers into a single PR in the above step.

[Top](#top)

### <a href="#workstream-api-tips" id="workstream-api-tips"></a> Tips for Workstream API Deployments

If there are multiple APIs under the same area (e.g. there are multiple 'Event' APIs) then the order matters when deploying into a region.  This is to ensure the API base paths are consistent among regions (eve1, eve2, eve3, etc.).

If in doubt about the sequence, review the existing base paths in the lowest environment (sandbox) and process in that order.  See the 'eve' entries in the below screenshot for an example of order to follow.  
![BasePaths](./_images/base-paths.png)

To process any needed changes quickly:

* If you have multiple swagger files to update, they can all be processed in a single PR.
* Do not create a PR for a release trigger file until the associated swagger file has been merged. This PR can also contain the deploy trigger file.
* The most efficient way to process these API file changes in parallel is to process the swaggers first, then you can process all the trigger files last.

>NOTE:  The track/release and track/deploy file can be in a single PR for each API.  The swagger files can be combined into one PR which covers multiple APIs.

[Top](#top)

## <a href="#verify-tests" id="verify-tests"></a>VALIDATE: Verify Integrated Test Results

The integrated tests run in Jenkins as the merge is completed.  Navigate to the Jenkins run the for the merge-to-master performed in the previous step.

View the results in the Master: Dev Test --> Integration Test step.  
![MasterDevTest](./_images/master-dev-test.png).

Expand the results and scroll through to review all the test results - there are multiple test groupings so look at all of them.

All tests must pass this step before proceeding.  If there are any test failures they must be evaluated and remediated before proceeding.

>NOTE: If you did not deploy a new Integration Test package, the tests will not run when  the integration-aas package is deployed by itself.  To force the Integration Tests to run, update the track/testdeploy file contents for the current Integration Test package version.  When the track/testdeploy file is merged, the Integration Tests will run in DEV.

[Top](#top)

## <a href="#sanity-test" id="sanity-test"></a>VALIDATE: Run Sanity Tests

The sanity tests are run manually using Postman.  The tests are located in the [integration-aas/testing/sanityTests](https://github.dxc.com/Platform-DXC/integration-aas/tree/master/testing/sanityTests) folder.

Run the tests against the DEV environment using the environment file included in the folder.  All tests need to pass successfully before moving on to the next steps.

[Top](#top)

## <a href="#get-approval" id="get-approval"></a> PROMOTE: Get Approval to Mark Stable

Before a package can be marked stable, approval is required from the Product Owner.

This approval must be documented in a JIRA task associated with the sprint.

>NOTE:  DO NOT PROCEED WITH ANY ADDITIONAL "PROMOTE" STEPS UNTIL THIS APPROVAL IS DOCUMENTED

[Top](#top)

## <a href="#mark-aas-stable" id="mark-aas-stable"></a>PROMOTE: Mark the AAS Package Stable

Locate the track/release file made in the [earlier step](#create-release) creating the AAS package.

>NOTE:  Ensure the track/release file is the ONLY file in the pull request.

Update the `prerelease` value to `false` and submit a pull request against the integration-aas `master` branch.

[Top](#top)

## <a href="#utilities-stable" id="utilities-stable"></a>PROMOTE: Mark the Integration Deploy Utilities Package Stable

If an updated Integration Deploy Utilities package was released in the [earlier step](#utilities-release), update the associated track/release file as described [here](https://github.dxc.com/Platform-DXC/integration-api/blob/master/docs/APIManagementGettingStarted.md#-step-4---request-deployment-to-test).

This will mark the package stable and make it eligible for promotion to the TEST environment.

[Top](#top)

## <a href="#mark-int-api-stable" id="mark-int-api-stable"></a>PROMOTE: Mark the Integration APIs Stable

For any Integration APIs that were deployed in the [earlier step](#deploy-integration-api), update their associated track/release file as described [here](https://github.dxc.com/Platform-DXC/integration-api/blob/master/docs/APIManagementGettingStarted.md#-step-4---request-deployment-to-test).

This will mark the packages stable and make them eligible for promotion to the TEST environment.

[Top](#top)

## <a href="#mark-int-test-stable" id="mark-int-test-stable"></a>PROMOTE: Mark the Integrated Test Package Stable

Locate the track/release file made in the [earlier step](#int-test-release) creating the Integrated Test package.

>NOTE:  Ensure the track/release file is the ONLY file in the pull request.

Update the `prerelease` value to `false` and submit a pull request against the integration-aas `master` branch.

Once the PR is approved and merged into `master`, Verify the results of the merge and address any errors as required before moving to the next step.

[Top](#top)

## <a href="#mark-ws-api-stable" id="mark-ws-api-stable"></a>PROMOTE: Mark the Workstream APIs Stable

For any Workstream APIs that were deployed in the [earlier step](#deploy-workstream-api), update their associated track/release file as described [here](https://github.dxc.com/Platform-DXC/integration-api/blob/master/docs/APIManagementGettingStarted.md#-step-4---request-deployment-to-test).

This will mark the packages stable and make them eligible for promotion to the TEST environment.

[Top](#top)

## <a href="#review-dev2-pipeline" id="review-dev2-pipeline"></a>PROMOTE: Review DEV2 Pipeline Execution

As code is promoted into the DEV2 environment, review the pipeline results in the [release-pipeline master Jenkins](https://jenkins.platformdxc.com/job/Platform%20DXC/job/release-pipeline/job/master/) pipeline runs.  Runs against the DEV2 region can be identified by looking for 'DEV2' under the build numbers.

Click on the 'Tests' option along the top menu to view test results for the pipeline.

Ensure all test ran successfully.  The test steps/names which display on this screen are the same as the test names in the Integration Test package (e.g. 01-Validate Mock Tags).

[Top](#top)

## <a href="#review-test-pipeline" id="review-test-pipeline"></a>PROMOTE: Review TEST Pipeline Execution

As code is promoted into the TEST environment, review the pipeline results in the [release-pipeline master Jenkins](https://jenkins.platformdxc.com/job/Platform%20DXC/job/release-pipeline/job/master/) pipeline runs.  Runs against the TEST region can be identified by looking for 'TEST' under the build numbers. 

Click on the 'Tests' option along the top menu to view test results for the pipeline.

Ensure all test ran successfully.  The test steps/names which display on this screen are the same as the test names in the Integration Test package (e.g. 01-Validate Mock Tags).

[Top](#top)

## <a href="#review-stage-pipeline" id="review-stage-pipeline"></a>PROMOTE: Review STAGE Pipeline Execution

As code is promoted into the STAGE environment, review the pipeline results in the [release-pipeline master Jenkins](https://jenkins.platformdxc.com/job/Platform%20DXC/job/release-pipeline/job/master/) pipeline runs.  Runs against the STAGE region can be identified by looking for 'STAGE' under the build numbers. 

Click on the 'Tests' option along the top menu to view test results for the pipeline.

Ensure all test ran successfully.  The test steps/names which display on this screen are the same as the test names in the Integration Test package (e.g. 01-Validate Mock Tags).

[Top](#top)

## <a href="#review-prod-pipeline" id="review-prod-pipeline"></a>PROMOTE: Review PROD Pipeline Execution

As code is promoted into the PROD environment, review the pipeline results in the [release-pipeline master Jenkins](https://jenkins.platformdxc.com/job/Platform%20DXC/job/release-pipeline/job/master/) pipeline runs.  Runs against the PROD region can be identified by looking for 'PROD' under the build numbers. 

Click on the 'Tests' option along the top menu to view test results for the pipeline.

Ensure all test ran successfully.  The test steps/names which display on this screen are the same as the test names in the Integration Test package (e.g. 01-Validate Mock Tags).

[Top](#top)

## <a href="#update-metrics" id="update-metrics"></a>POST-DEPLOY:  Update Testing Metrics

Review the release-pipeline test results for the latest runs of all packages associated with the Integration Team:

- tests-integration-aas
- tests-integration-api-core
- tests-integration-serviceramp
- tests-security-wam

>NOTE: Not all of these packages are part of these deployment instructions.  This task is included here as a catch-all for all Integration-related packages at the end of a sprint.

Total up the number of responses reported for each package.  Some packages may have more than one set of test results in the pipeline since they have multiple collections inside one Artifactory package.

Use the total number of 'assertions' as shown in the example below to get the counts for each collection.

![Assertions](./_images/test-counts.png)

Compare the test counts to the numbers currently in the [Testing Status and Metrics](https://github.dxc.com/Platform-DXC/testing/blob/master/scrumteam/TestingStatusAndMetricsByPillar.md#testing-status-by-pillar) document.  The test results from these packages go into both the 'Functional Tests' and 'Integration Tests' columns.

If tests have been added or removed and impact the counts, submit a pull request against the document to reflect the changes.  If the counts remain the same no further action is required.

[Top](#top)
