# <a href="#top" id="top"></a> INTEGRATION-API UTILITIES

## Table of Contents
* [API Utilities](#api)
* [Introduce CHANGELOG.md to integration-deploy-utilities](#introduce)
* [Changes made in realease-utility-package.sh](#changes)
* [How to test the process](#process)
	* [Positive testing](#positive)
	* [Negative testing](#negative)

## <a href="#api" id="api"></a> API Utilities

This folder contains utilities required to validate and prime OpenAPI definition files before presenting them to the API Gateway.  The utilities include:

* `AWS-Swagger-Tools.json` which is a Postman project file than can be used to Validate, Mock and Tag the OpenAPI definition files before presenting to the AWS Gateway.

# <a href="#introduce" id="introduce"></a>Introduce CHANGELOG.md to integration-deploy-utilities

We are introducing a [CHANGELOG.md](https://github.dxc.com/Platform-DXC/release-pipeline/blob/9946c380f386c742af5ce4b9688d1ea9f99d0e54/docs/CHANGE.md ) under integration-deploy-utilities package in order to look the notable changes have been made between each release (or version).

* The component must provide at the root level of the component zip package a file named `/CHANGELOG.md`.
* Ensure to include the most recent version of the integration-deploy-utilities into the `/CHANGELOG.md`.

[Top](#top)

# <a href="#changes" id="changes"></a> Changes made in realease-utility-package.sh

The Integration Deploy Utilities package is a common package used for deploying all APIs. This release package is not always required to be rebuilt - the deployment coordinator should be aware of changes which would require these steps to be performed.

* Updated integration-api/utilities/release-utility-package.sh by adding a line to include the changelog.md file

  `zip -j ${RELEASE_FILE} track/release/pdxc/integration-deploy-utilities/changelog.md`.
  
* We have used the -j option for the zip command to have the directory ignored and allowing the changelog.md file to be put into the root directory of the zip file i.e, under `integration-deploy-utilities`.

[Top](#top)

# <a href="process" id="process"></a>How to test the process
Changes are made for testing as show below:

* We can test the process by considering two stages from jenkins i.e, `Establish Required Work` and `Publish Release`.
  * Establish Required Work stage determines the new files added or updated.
  * Publish release stage is used for validate changelogs.
* So given below is the code snippet of Jenkins file:
  ```json        
  stages {
   	stage('Establish Required Work'){
			....
		}
	
	 stage('Publish Release'){
			steps{
					sh '''
					bash -x release-package.sh
					'''
					sh 'node utilities/pipeline/release/verifyReleaseRequest.js pullrequest ${CHANGE_ID}'
				}
			}
		}
	  }
	```

* By removing all old track/release files for integrationdeployutilities (track/release) and include ONE file called integrationDeployUtilities.json.

* Below code snippet is called is put inside integrationDeployUtilities.json:
  
  ```json
  {
    "tag_name": "IntegrationDeployUtilities(1.0.25)",
    "target_commitish": "master",
    "name": "Integration Deploy Utilities",
    "body": "Integration Deploy Utilities for deploy other api packages. ",
    "draft": false,
    "release_file": "integration-deploy-utilities.zip",
    "api_name": "integrationDeployUtilities",
    "api_bundle": [],
    "release_version": "1.0.25",
    "change_log":"tarck/release/integration-deploy-utilities/CHANGELOG.md"
   }
  ```
  
[Top](#top)  

## <a href="#positive" id="positive"></a>Positive testing

* Once the changes made in `release-utility-package`.
	
* We can test through the s3 bucket,make sure you have created bucket manually or throught cli and add the snippet  inside the `release-package.sh` as shown below:
    
      if [ $RELEASE_FILE = "integration-deploy-utilities.zip" ]
      then
      bash -x utilities/release-utility-package.sh
      `aws s3 cp $RELEASE_FILE s3://bucket-name`
      exit 0
      fi

* So that once you raise the pull-reuqest against `master-branch` .You can view the result is stored in the s3 bucket.     

[Top](#top)

## <a href="#negative" id="negative"></a>Negative testing

### Test case-1

* If changelog does not have current release, then the pipeline should fail 
* By removing the latest version from the CHANGELOG.md file under `integration-deploy-utilities` folder:
* Result is as show below:

		[2019-03-02T00:22:20.878Z] + node utilities/pipeline/release/verifyReleaseRequest.js pullrequest 2094
 		[2019-03-02T00:22:21.446Z] Error: Release version '1.0.25' not found in Change Log.
 		[2019-03-02T00:22:21.446Z] Release verification exited with Errors.

[Top](#top)

### Test case-2
* If no changelog in the track/release file, the pipeline should fail.
* Make changes in the integrationDeployUtilities.json as show below:
```json
   {
    "tag_name": "IntegrationDeployUtilities(1.0.25)",
    "target_commitish": "master",
    "name": "Integration Deploy Utilities",
    "body": "Integration Deploy Utilities for deploy other api packages. ",
    "draft": false,
    "release_file": "integration-deploy-utilities.zip",
    "api_name": "integrationDeployUtilities",
    "api_bundle": [],
    "release_version": "1.0.25"
   }
   ```
* Result is as show below:

 		[2019-03-03T14:51:34.279Z] + node utilities/pipeline/release/verifyReleaseRequest.js pullrequest 2094
  		[2019-03-03T14:51:34.822Z] Error: 'change_log' not defined in release specification.
  		[2019-03-03T14:51:34.822Z] Release verification exited with Errors.

[Top](#top)

### Test case-3
* If the directory in the track/release file is wrong, the pipeline should fail
* Make changes in the integrationDeployUtilities.json as show below:
```json
  {
    "tag_name": "IntegrationDeployUtilities(1.0.25)",
    "target_commitish": "master",
    "name": "Integration Deploy Utilities",
    "body": "Integration Deploy Utilities for deploy other api packages. ",
    "draft": false,
    "release_file": "integration-deploy-utilities.zip",
    "api_name": "integrationDeployUtilities",
    "api_bundle": [],
    "release_version": "1.0.25",
   "change_log":"tarck/release/CHANGELOG.md"
  }
  ```

* Result is as show below:
 		
 		[2019-03-02T00:20:24.545Z] Error: track/release/pdxc/CHANGELOG.md does not exist as a Change Log.
  	 	[2019-03-02T00:20:24.545Z] Error: ENOENT: no such file or directory, open 'track/release/pdxc/CHANGELOG.md'
  	 	[2019-03-02T00:20:24.545Z]     at Error (native)
  	 	[2019-03-02T00:20:24.545Z] Release verification exited with Errors.


[Top](#top)      

