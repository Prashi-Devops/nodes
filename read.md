# <a href="#top" id="top"></a>Creating a New Service Type

The purpose of this document is to list the necessary steps for adding a new ServiceType to SIF (both ServiceRamp and CIS), creating the release-pipeline test artifacts and default user credentials.

When a new ServiceType is requested, each of the following areas should be included as a Jira task.  The grooming information for each task should be copied from this document's associated section.

* [PreRequisites](#prerequisite)

## Standard (Green Line) task description
* [ServiceType](#servicetype)    **DINESH**
* [Schema](#schema)				**DINESH**
* [InboundService](#inboundservice)		**DINESH**
* [Maps](#maps)						**DINESH**
* [Templates](#templates)			**DINESH**
* [Flow Segments](#flowsegments)		**DINESH**
* [Rapid Deploy SR](#rapiddeploysr)		**DINESH**
* [Unit Testing GreenLine](#unitgreen)
* [Post API Deploy](#postdeploy)
* [SR Manual Steps](#manualsteps)   **DINESH**** edgar has them **
* ** DINESH **  add developer testing in DEV ** Edgar **
* [Test Preparation](#testprep)
* [Testing](#testing)
>Note:   Missing the standard Developer tests in DEV Ask Edgar

## Custom (Red Line) Task Description
> Note that all Standard (green line) tasks are pre-requisites to Custom (red line) tasks

> Note - red line tasks have not had the items done in Green line removed yet

* [Schema](#rschema)
* [InboundService](#rinboundservice)
* [Lookups](#rlookups)
* [Maps](#rmaps)
* [Templates](#rtemplates)
* [Flow Segments](#rflowsegments)
* [Rapid Deploy SR](#rrapiddeploysr)
* [Rapid Deploy CIS](#rrapiddeploycis)
* [Unit Testing RedLine](#unitred)
* [Post API Deploy](#postdeploy)
* [SR Manual Steps](#rmanualsteps)
* [Test Preparation](#testprep)
* [Testing](#testing)

Reference
* [Reference Integration Patterns Diagram](#refintgpatterns)

[Top](#top)

##  <a href="#prerequisite" id="prerequisite"></a>PreRequisites

When a new Service Type is defined, the following are the pre-requisites to creating artifacts.

* Standard eBond definition for service type

  * https://github.dxc.com/pages/Platform-DXC/integration-ebond/std-ebond/strategic/

* ICD and DMW Document

  * https://github.dxc.com/pages/Platform-DXC/integration-ebond/document-templates/legacy

* Swagger definition (that includes the request / response definitions)

  * https://github.dxc.com/Platform-DXC/integration-api/blob/master/apis/readme.md
  * The API must be deployed to the AWS sandbox environment

* Mapping Document for request/response to CIS internal schemas

  * https://dxcportal.sharepoint.com/sites/IntegrationFramework
  * In the Inventory/00Common/External/Schemas within the directory associated with the ServiceType (xlsx spreadsheet)

* List of lookup table values required for translation to ConnectNow (application level)

  * https://dxcportal.sharepoint.com/sites/IntegrationFramework
  * In the Inventory/00Common/External/Schemas within the directory associated with the ServiceType (xlsx spreadsheet)

* Model document to be shared in ServiceRamp which specifies the predefined lookup tables

  * https://dxcportal.sharepoint.com/sites/IntegrationFramework
  * In the Inventory/00Common/External/Schemas within the directory associated with the ServiceType (model document)

* Define tests and use cases

  * These can be based off of the work instructions:  https://dxcportal.sharepoint.com/sites/edge/sar/docs/edge/cap_esm
  * There may be multiple work instructions for a single service type
  * Additional test cases may be needed based on design requirements
  * Define both positive and negative test cases
  * All response codes supported by the API will have at least one test case defined

* Define the ServiceNow data needed to carry out the tests

  * This includes users, roles, and foundation data

* Onboard the data into ServiceNow needed to perform the tests

  * The data needs to be onboarded identically in all supported ServiceNow instances
  * The naming convention used for the data should be documented for consistency and repeatability

* Create or obtain ServiceNow credentials for use in all supported ServiceNow environments.

  * The standard user name convention for eBonds is pdxc.\<serviceType>.integration (e.g. _pdxc.change.integration)_
  * Request/Reply has an existing _pdxc.requestreply.api.gateway.integration_ user
  * ServiceRamp uses an existing _pdxc.onboarding.integration_ user
  * Additional users may be required based on use case definitions (e.g. a self-service user vs. an 'approver' with additional roles may both be needed to cover a specific use case)
  * Supply credentials to the Integration Team for use in creating the test packages

> All request schemas should come predefined with 10 custom fields.  If the schema does not have this, then go back to the Architecture team for verification.

[Top](#top)
