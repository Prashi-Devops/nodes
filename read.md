# <a href="#top" id="top"></a>Service Ramp Deployment Guide

## Purpose

This document provides the steps required to deploy Service Ramp.  This document is intended to be followed by a person knowledgeable of Service Ramp and release pipeline with all relevant access.  It is not intended to cover every troubleshooting scenario or unique deployment condition.

Each process stage should be completed in its entirety before moving to the next stage.

## Table of Contents

* [Stage Definitions](#stages)

**PREPARE**

* [PREPARE: Remove Code Not Releasing](#remove-code)
* [PREPARE: Incorporate Break/Fixes](#break-fix)
* [PREPARE: Validate Any Policy Changes](#validate-policy)
* [PREPARE: Process Outstanding Pull Requests for Coding Changes](#create-pull-request)
* [PREPARE: Update the Changelogs](#verify-changelog)

**DEPLOY**

* [DEPLOY: Create the ServiceRamp Release Package & Deploy to DEV](#create-release)
* [DEPLOY: Create the Integrated Test Release Package & Deploy to DEV](#int-test-release)
* [DEPLOY: Create the Integrated Rapid Release Package & Deploy to DEV](#int-rapid-release)
* [DEPLOY: Create the Integrated Data Package Release Package](#int-data-packagerelease)

**VALIDATE**

* [VALIDATE: Verify Integrated Test Results](#verify-tests)

**PROMOTE**

* [PROMOTE: Get Approval to Mark Stable](#get-approval)
* [PROMOTE: Mark the ServiceRamp Package Stable](#mark-sr-stable)
* [PROMOTE: Mark the Integrated Test Package Stable](#mark-int-test-stable)
* [PROMOTE: Review TEST Pipeline Execution](#review-test-pipeline)
* [PROMOTE: Review STAGE Pipeline Execution](#review-stage-pipeline)
* [PROMOTE: Review PROD Pipeline Execution](#review-prod-pipeline)

## <a href="#stages" id="stages"></a>Stage Definitions

Each step is tied to a stage in the process.  

|Stage| Definition of Done|
|---|---|
|PREPARE| All required files are submitted in a Pull Request to GitHub.  The Pull Request has been merged. |
|DEPLOY|The Release/ZIP file is created and present in Artifactory. The package has been successfully deployed to DEV. |
|VALIDATE|Test package execution in DEV is validated.  Any smoke test or additional release testing is completed successfully. |
|PROMOTE|The package has been promoted outside of DEV. |

[Top](#top)

## <a href="#remove-code" id="remove-code"></a>PREPARE: Remove Code Not Releasing

Determine if there is any code that has been merged into GitHub which has not been approved for inclusion in the current package.

Create pull requests as required to back out unwanted changes.

[Top](#top)

## <a href="break-fix" id="break-fix"></a> PREPARE: Incorporate Break/Fixes

Review the code included in the upcoming package scope and verify that all testing is complete and any break/fix changes have been performed, tested, and merged.

[Top](#top)

## <a href="#validate-policy" id="validate-policy"></a>PREPARE: Validate Any Policy Changes

**TBD - Does ServiceRamp have any Policies or Roles which need to be validated?**

[Top](#top)

## <a href="#create-pull-request" id="create-pull-request"></a>PREPARE: Process Outstanding Pull Requests for Coding Changes

All code changes related to the release need to be completed and with their pull requests **approved and merged** in the [`integration-serviceramp/master`](https://github.dxc.com/Platform-DXC/integration-serviceramp) branch of GitHub.  Create a pull request for any code which still needs to be added to the release and notify the approver that there are still outstanding items.

Review all open pull requests in the repositories to ensure all necessary items have been approved.

Verify in Jenkins that the merge requests process without errors.  Check the results shown on the Pull Request items, and also check in the "Commits" for the `master` branch to make sure the merge completed successfully.  

[Top](#top)

## <a href="#verify-changelog" id="verify-changelog"></a>PREPARE: Update the Changelogs

Before creating the **ServiceRamp Release Package**, view the contents of the [CHANGELOG.md](https://github.dxc.com/Platform-DXC/integration-serviceramp/blob/master/CHANGELOG.md) to ensure the release number you are creating is represented in the file.  This file is required by the release pipeline process.

Before creating the **Integrated Test Release Package**, view the contents of the [Testing CHANGELOG.md](https://github.dxc.com/Platform-DXC/integration-serviceramp/blob/master/track/testrelease/CHANGELOG.md) to ensure the release number you are creating is represented in the file.  This file is required by the release pipeline process. 

Before creating the **Integrated Rapid Release Package**, view the contents of the [Rapid CHANGELOG.md](https://github.dxc.com/Platform-DXC/integration-serviceramp/blob/master/track/rapidrelease/CHANGELOG.md) to ensure the release number you are creating is represented in the file.  This file is required by the release pipeline process.

Before creating the **Integrated Data Package Release**, view the contents of the respective data packages. Let us take rapid_change_ebond as an example [rapid_change_ebond - CHANGELOG.md](https://github.dxc.com/Platform-DXC/integration-serviceramp/blob/master/track/data-packagerelease/rapid_change_ebond/CHANGELOG.md) to ensure the release number you are creating is represented in the file.  This file is required by the release pipeline process.

These files should have been updated prior to the end of the sprint, but if you are bumping the version number on the package (e.g. to address minor issues found during earlier deploy steps) you will need to update the version info in this file to include the version number you are packaging.

[Top](#top)

## <a href="#create-release" id="create-release"></a>DEPLOY: Create the ServiceRamp Release Package and Deploy to DEV

There are two manual tasks which may be required prior to creating the ServiceRamp Package.
1. [Update the Boostrap Script](../internal/docs/HOWTO_AmazonSSMAgentStuckOnStarting.md)
2. Recreate the AMI if there are any code changes

The deployment lead will determine if these are required prior to packaging, then continue with the steps below.

The release and deploy triggers can be combined into a single PR.  This will create the package and deploy it to DEV in a single step.

Create a json file with the following naming convention: \<release_version>.json and place it in the [`track/release`](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/release) folder in the `integration-serviceramp/master` branch.

Example:  `1.0.24.json`

The file contents are as described below

```json
{
    "release_tag": "1.0.4",
    "tag_name": "1.0.4",
    "target_commitish": "master",
    "name": "Service Ramp Install Packages",
    "description": "integration service ramp deploy package",
    "body": "Sprint 8 Release Package",
    "draft": false,
    "prerelease": true,
    "release_file": "integration-serviceramp.zip",
    "change_log": "CHANGELOG.md"
}
```

<a href="#field_def" id="field_def"></a> Field definitions:

| Field | Contents |
| --- | --- |
| release_tag | The tag to apply to the release.  This should be the version number. You can see this tag in the [GitHub repository releases](https://github.dxc.com/Platform-DXC/integration-serviceramp/tags) 'tags' view. |
| tag_name | Use the same value from release_tag.|
| target_commitish | The Github repository branch from which the release should be generated.  This should always be 'master'. |
| name | The title of the release.  You can see this name in the [Github repository releases](https://github.dxc.com/Platform-DXC/integration-serviceramp/releases) 'releases' view. |
|description| A short description of the release.|
| body |The full description of the release.  You will see this value in the [Github repository releases](https://github.dxc.com/Platform-DXC/integration-serviceramp/releases) 'releases' view under the name/title. |
| draft | Indicates if the release should be registered as a draft or not (true/false) |
| prerelease | Indicates if the release is final or not (true/false).  Always set this to true when deploying to Dev. **NOTE**: This value will be updated when releasing to Test in a later step. |
| release_file| This will be the version number followed by `.zip`.|
| change_log | Should record the location of the CHANGELOG.md file that should be packaged with the release. No matter what the filename is here, Change Log will always be called CHANGELOG.MD and be at the root of the package delivered to Artifactory.|

Create an md file with the following naming convention: \<environment>\_\<release_version>.md and place it in the [`track/deploy`](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/deploy) folder in the `master` branch.

The release file name is the value entered in the `release_file` key-value pair in the release trigger file created in the [prior step](#create-release), minus any file extension.  Use the DEV environment identifier as a prefix. Example:

    Release file `release_file` value:  1.0.4.zip
    Deployment Trigger File Name:  DEV_1.0.4.md

The file does not need to have any content.  It only needs to be present.  Place this file into the [integration-serviceramp/track/deploy/](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/deploy) folder.

<a href="#pull_req" id="pull_req"></a><b> To Create a PR </b>:

Create a pull request for the two files and notify the approver to work the request.

The release package creation is fully automated. When the files described in this section are merged into the `master` branch the package will be built automatically based on the contents of this file, then it will be deployed into the DEV environment.

Verify in Jenkins that the merge and deploy processed successfully. Verify the package as needed in Artifactory.

Address any errors from the Jenkins run before moving to the next step.

## <a href="#int-test-release" id="int-test-release"></a>DEPLOY:  Create the Integrated Test Release Package & Deploy to DEV

The Integrated Test package contains automated tests which run in the pipeline.  To create a new package, create a json file in the [integration-serviceramp/track/testrelease](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/testrelease) folder in the `master` branch.  The file name convention is \<release_version>.json.

Example:  `1.0.6.json`

Sample file:

```json
{
    "release_tag": "1.0.4",
    "tag_name": "1.0.4",
    "name": "Integration ServiceRamp Test Package ",
    "description": "Package for testing Integration ServiceRamp components",
    "prerelease": true,
    "release_file": "tests-integration-serviceramp.zip",
    "change_log": "track/testrelease/CHANGELOG.md" 
}
```

<b>Field definitions</b>:

The detailed description for [field definitions](#field_def).

>NOTE:  The release_file name must start with _**tests-**_.

Update the CHANGELOG.md file in the track/testrelease folder under the integration-serviceramp/master branch with the latest release version.

Example:
The file contents are as described below:

```md
# TESTS-INTEGRATION-SERVICERAMP

This package performs Integration testing of the ServiceRamp application.

<!-- put the most current version at the top-->
<!-- see https://github.dxc.com/Platform-DXC/release-pipeline/blob/master/docs/CHANGE.md for details on creating the log -->
<!-- Keywords: ADDED, CHANGED, FIXED, SECURITY, PERFORMANCE, DOCUMENTATION, PIPELINE -->

## [1.0.4]
* [DOCUMENTATION] Updated the test names to log using the standard naming conventions. (PDXC-13194)
* [NON-IMPACTING] - This is not a change in functionality. It only changes the test names logged when tests are viewed in the release-pipeline results. 
```



Create an md file with the following naming convention: \<environment>\_\<release_version>.md and place it in the [`track/testdeploy`](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/testdeploy) folder in the `master` branch.

The release file name is the value entered in the `release_file` key-value pair in the release trigger file created in the [prior step](#int-test-release), minus any file extension.  Use the DEV environment identifier as a prefix. Example:

    Release file `release_file` value:  1.0.4.zip
    Deployment Trigger File Name:  DEV_1.0.4.md

The file does not need to have any content.  It only needs to be present.  Place this file into the [integration-serviceramp/track/testdeploy/](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/testdeploy) folder.

<b> To Create a PR </b>:

The detailed description for [creating a PR](#pull_req).

[Top](#top)

## <a href="#int-rapid-release" id="int-rapid-release"></a>DEPLOY: Create the Integrated Rapid Release Package & Deploy to DEV

Create a json file and place it in the [`track/rapidrelease`](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/rapidrelease) folder in the `integration-serviceramp/master` branch.

Example: 

The file contents are as described below:

```json
{
    "release_tag": "1.0.13",
    "tag_name": "1.0.13",
    "name": "Integration ServiceRamp Rapid Deployment Package",
    "description": "Package for Integration ServiceRamp Rapid Deployment components",
    "prerelease": false,
    "release_file": "integration-serviceramp-rapid.zip",
    "change_log": "track/rapidrelease/CHANGELOG.md"
}
```

<b>Field definitions</b>:

The detailed description for [field definitions](#field_def).

Update the CHANGELOG.md file in the track/rapidrelease folder under the integration-serviceramp/master branch with the latest version.

Example:
The file contents are as described below:

```md
# INTEGRATION-SERVICERAMP-RAPID

This package encompasses Platform DXC ServiceRamp Deploy package for various ServiceTypes

<!-- put the most current version at the top-->
<!-- see https://github.dxc.com/Platform-DXC/release-pipeline/blob/master/docs/CHANGE.md for details on creating the log -->
<!-- Keywords: ADDED, CHANGED, FIXED, SECURITY, PERFORMANCE, DOCUMENTATION, PIPELINE -->

## [1.0.13]

* [FIXED] discrepancy between release pipeline env name and manifest.json
```
The release file name is the value entered in the `release_file` key-value pair in the release trigger file created in the [prior step](#int-rapid-release), minus any file extension.  Use the DEV environment identifier as a prefix. Example:

    Release file `release_file` value:  1.0.13.zip
    Deployment Trigger File Name:  DEV_1.0.13.md

The file does not need to have any content.  It only needs to be present.  Place this file into the [integration-serviceramp/track/rapiddeploy/](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/track/rapiddeploy) folder.


<b> To Create a PR </b>:

The detailed description for [creating a PR](#pull_req).

[Top](#top)

## <a href="#int-data-packagerelease" id="int-data-packagerelease"></a>DEPLOY: Create the Integrated Data Package Release

For every Data Package Release, we need to have a seperate json and CHANGELOG.md file. Let us consider the rapid_change_ebond as an example. The following are the steps to be followed to create the json and its respective CHANGELOG.md file:

Create a json file called rapid_change_ebond.json and place it in the [`track/data-packagerelease/rapid_change_ebond`](https://github.dxc.com/Platform-DXC/integration-serviceramp/blob/master/track/data-packagerelease/rapid_change_ebond) folder in the `integration-serviceramp/master` branch.

Example: 

The file contents are as described below:

```json
{
    "release_tag": "1.0.10",
    "tag_name": "1.0.10",
    "name": "Integration ServiceRamp Data Package ",
    "description": "Data Package for Integration ServiceRamp components",
    "prerelease": false,
    "release_file": "rapid_change_ebond.zip",
    "change_log": "track/data-packagerelease/rapid_change_ebond/CHANGELOG.md"
}
```
<b>Field Definitions</b>:

The detailed description for [field definitions](#field_def)

Update the CHANGELOG.md file in the track/data-packagerelease/rapid_change_ebond folder under the integration-serviceramp/master branch with the latest version.

Example:
The file contents are as described below:

```md
# INTEGRATION-SERVICERAMP-DATA-PACKAGE
 This package encompasses Platform DXC ServiceRamp.
 <!-- put the most current version at the top-->
<!-- see https://github.dxc.com/Platform-DXC/release-pipeline/blob/master/docs/CHANGE.md for details on creating the log -->
<!-- Keywords: ADDED, CHANGED, FIXED, SECURITY, PERFORMANCE, DOCUMENTATION, PIPELINE -->
## [1.0.10]
* [ADDED] SQL statement to chanage all application look up table "applicatoin" column value to be "PDXC".
* [ADDED] SQL statement to add/update records in TemplatePublishType table.
* [ADDED] APIGateway_Header mapping to the package.
* [FIXED] Re-extracted the LiteChangeV2_To_CISMessage after update.
* [FIXED] stored procedure definitions for upsertLookUpTables.  Included with AMI.
```


>NOTE: As described above, we need to add json and CHANGELOG.md for each data packages under track/data-packagerelease/{package_name}. (package_name example: for Incident it will be like "rapid_incident_ebond")

<b> To Create a PR </b>:

The detailed description for [creating a PR](#pull_req).

>NOTE:  Before deploying to Sandbox is needed to execute the AWS CLI command "put-parameter" to populate the SSM parameters. The command is found in the [integration-serviceramp/init-serviceramp/ssm-para/svr_DEPLOY_CONFIGURATIONS-sandbox.sh](https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/init-serviceramp/ssm-para/svr_DEPLOY_CONFIGURATIONS-sandbox.sh) file. 

[Top](#top)

## <a href="#verify-tests" id="verify-tests"></a>VALIDATE: Verify Integrated Test Results

The integrated tests run in Jenkins as the merge is completed.  Navigate to the Jenkins run the for the merge-to-master performed in the previous step.

View the results in the Master: Dev Test --> Integration Test step.  Example:  
![MasterDevTest](./images/master-dev-test.png).

Expand the results and scroll through to review all the test results - there may be multiple test groupings so look at all of them.

All tests must pass this step before proceeding.  If there are any test failures they must be evaluated and remediated before proceeding.

[Top](#top)

## <a href="#get-approval" id="get-approval"></a> PROMOTE: Get Approval to Mark Stable

Before a package can be marked stable, approval is required from the Product Owner.

This approval must be documented in a JIRA task associated with the sprint.

>NOTE:  DO NOT PROCEED WITH ANY ADDITIONAL "PROMOTE" STEPS UNTIL THIS APPROVAL IS DOCUMENTED

[Top](#top)

## <a href="#mark-sr-stable" id="mark-sr-stable"></a>PROMOTE: Mark the ServiceRamp Package Stable

Locate the track/release file made in the [earlier step](#create-release) creating the ServiceRamp package.

>NOTE:  Ensure the track/release file is the ONLY file in the pull request.

Update the `prerelease` value to `false` and submit a pull request against the integration-serviceramp `master` branch.

[Top](#top)

## <a href="#mark-int-test-stable" id="mark-int-test-stable"></a>PROMOTE: Mark the Integrated Test Package Stable

Locate the track/release file made in the [earlier step](#int-test-release) creating the Integrated Test package.

>NOTE:  Ensure the track/release file is the ONLY file in the pull request.

Update the `prerelease` value to `false` and submit a pull request against the integration-serviceramp `master` branch.

Once the PR is approved and merged into `master`, Verify the results of the merge and address any errors as required before moving to the next step.

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
