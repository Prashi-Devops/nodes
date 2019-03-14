# <a href="#top" id="top"></a>Creating a New Service Type

The purpose of this document is to list the necessary steps for adding a new ServiceType to SIF (both ServiceRamp and CIS), creating the release-pipeline test artifacts and default user credentials.

When a new ServiceType is requested, each of the following areas should be included as a Jira task.  The grooming information for each task should be copied from this document's associated section.

* [PreRequisites](#prerequisite)

## Standard (Green Line) task description
* [ServiceType](#servicetype)   
* [Schema](#schema)				
* [InboundService](#inboundservice)		
* [Maps](#maps)						
* [Templates](#templates)			
* [Flow Segments](#flowsegments)		
* [Rapid Deploy SR](#rapiddeploysr)		
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

##  <a href="#servicetype" id="servicetype"></a>ServiceType

*Requirement*

  Add the ability to create artifacts in ServiceRamp related to a Service Type that does not yet exist.

*Pre-Requisites*

  Architecture team has provided the name of the Service Type and a one sentence description to be displayed on the Create Flow screen.

*Description*

* Steps to introduce a new service type in Service Ramp :
       	
	* Insert a row into [SSP_DB].[dbo].[ServiceType] table with values of new Service Type
	* Insert a row into [SSP_DB].[dbo].[ServiceOffering] using ID of the new serviceType of above step
	* Change Status to 1 in [SSP_DB].[dbo].[ServiceType] of the new service type row when it is ready to be used
	* Insert rows into [SSP_DB].[dbo].[TemplateDrawingSelector] table with values of new Service Type based on ServiceOfferingId 
	* Insert rows into [SSP_DB].[dbo].[TransactionType] table with values of new Service Type based on ServiceOfferingId

* Low level instructions:
	* Include in the Post deployment script ReferenceData_ServiceType.sql the new service type.
	* Include in the Post deployment script ReferenceData_ServiceOfferinf.sql the new service offering related to the new service type.
 
 
*Success Criteria*

* When a user logs into ServiceRamp, the following are true:
	*   In the Flow Overview screen, the left pane list of Service Types includes the new Service Type
	*   In the Flow Summary screen, a new box is displayed with the New ServiceType
*   In the Create Flow - Flow Setup screen, a new box is displayed with the new Service Type and the one sentence description provided by Architecture.
*   A template, flow, flow segment, lookup table, etc. can be created for the new Service Type

* The Rapid Deploy package contains post deployment scripts for the ServiceType and ServiceOffering

*Output*

* Post deployment script ReferenceData_ServiceType.sql the new service type
* Post deployment script ReferenceData_ServiceOfferinf.sql the new service offering related to the new service type

*Outcome*

Once the success criteria is complete, a ServiceRamp Engineer can configure a Service Types artifacts.

[Top](#top)

##  <a href="#schema" id="schema"></a>Schema 

*Requirement*

Provide in ServiceRamp a schema for the Service Type that matches the swagger definition and the data model.

*Pre-Requisites*
* API Swagger documentation
* XSD document in Sharepoint provided by Architecture https://dxcportal.sharepoint.com/sites/IntegrationFramework/Inventory/00_Common/External/Schema/

*Description*

* Ensure that any "simple" array structures have been converted to  "complex" array structures 
	* These are instructions to make changes to handle arrays for eBond schemas (i.e. LiteChangeV2, LiteIncidentV2, ...etc). Reason for changing the structure is two-fold:
		* The svcutil.exe will generate the datacontract without errors (otherwise it fails) 	
		* This JSON generated from the XML structure (using the datacontract) will match the JSON expected by ConnectNow. 
### Wrong way :

```xml
<xs:element name="affectedCis" maxOccurs="unbounded" minOccurs="0" type="xs:string">
```

### Correct way :


```xml
<xs:element name="affectedCis" minOccurs="0">
      <xs:complexType>
           <xs:sequence>
                 <xs:element maxOccurs="unbounded" minOccurs="0" name="string" type="xs:string" />
            </xs:sequence>
       </xs:complexType>
 </xs:element>
```

* Upload the schema into ServiceRamp Sandbox (get temporary Engineer access)
	* Enter the new ServiceType in Schema Name textbox
	* Ensure Canonical Schema is checked
	* Ensure Canonical Type is External
	* Select the correct ServiceType
	* Upload the XSD Schema/WSDL(s) file using Browse option
	* Update the task for SR Rapid deployment with the name and path of the Schema XSD

*Naming Convention*

* [SchemaType][Dataconcept][Version]. Example:  LiteChangeV2

*Deliverables*

* XSD for message format defined using specified criteria
* XSD loaded into ServiceRamp Sandbox
* Rapid Deploy task updated with Schema name

*Success Criteria*

* The XSD needs to be stored in SR SB AWS (as a source resource)
* xsd matches the definition of the message to be used in PDXC ebonds 
* Latest xsd is in sharepoint 
* SR Rapid Deploy task includes the latest xsd
* The database has been validated that the correct settings are in place to ensure that the Schema will show up when selecting schemas for the Service Type
* Test Document created and uploaded to the Jira task
* Review by a tech lead

*Outcome*

* Once this story is complete, the schema will be available in ServiceRamp ready for specifying in Templates and Maps.


[Top](#top)

##  <a href="#rinboundservice" id="inboundservice"></a>Inbound Services

Pre Requisites

* Schema
* Need Engineer permission in Global tenant to create an inbound service in global tenant

Outputs:

* Inbound Services for new service type

Description:

* Create the Inbound Service for new ServiceType by using Register Inbound service option in SR SB AWS
* Provide the Inbound Service name
* Select the newly created Schema Name from dropdown
* List of test cases
* Test the Inbound Service
	* Use it in a flow, publish and send transactions E2E (Use SOAP, Then Rest, PUT and Post methods)
		
Naming Convention:

	GenericService+_+[SchemaName]
	
	Example:
		GenericService_LiteChangeV2
Success Criteria:

* Create the necessary InboundService in ServiceRamp AWS Sandbox
* Create for SOAP/Rest
* Request schema needs to match with XSD with the service type
* Need a sync (match with ICD) and Async (Generic Response) response schema
* Put and Post service operations.
* List the InboundService in the SR Rapid deployment Task  
* Review from a TL
	
[Top](#top)

##  <a href="#maps" id="maps"></a>Maps 

*Requirement*
 * Create the to and from (between new service type and CIS Internal) maps in Service Ramp AWS Sandbox
 * For Standard (green line, before the red-line custom functionality is needed) maps do not need lookups (data value translation)

*Pre requisites*
 * Mapping Documents exist in Sharepoint that maps to and from the new service type and the CIS internal
 	* Inventory/00_Common/External/Schema
 * Schemas from the new service type exist in Service Ramp SB AWS
 * LiteResponse_ToCISMessage and CISMessage_ToLiteResponse maps exists in Service Ramp

*Description*
 * Create the to and from (between new service type and CIS Internal) maps in Service Ramp AWS Sandbox Under Global Tenant using the template editor
 * Utilize the mapping spreadsheet in sharepoint to match the fields and perform any needed functions
 * Map the Xtracustomerfields to extension
 * Include the mapping names in a SR Rapid Deploy package task

*Naming Convention*
 * Output naming convention:
 	* Lite[ServiceType]+[Version]+_+To+_+[TargetSchema]
 	* Example: LiteIncidentV2_To_CISMessage
 * Input naming convention:
 	* [SourceSchema]+_+To_++Lite[ServiceType]+[Version]
 	* Example: CISMessage_To_LiteIncidentV2

*Deliverables*
 * Mapping for request schema for ServiceType to CIS Internal
 	* Lite\{ServiceType}V2 -> Canonical
 * Mapping for CIS Internal to request schema for ServiceType
 	* CIS Internal -> Lite\{ServiceType}V2
 * Mapping for Lite Response should be verify (should already exists)
 	* LiteResponse_To_CISMessage
 * Inbound and outbound mapping for any response schema changes that are required for the new Service Type

*Success Criteria*
 * Mapping is testing in ServiceRamp using the Map Test feature to ensure that the fields are mapped correctly
 * SR Rapid Deploy task include latest mapping name
 * Test Document created and uploaded to the Jira task
 * Review by a tech lead

*Outcome*
 *  Once this story is complete and the maps exist for the ServiceType, the Templates can be finalized to be activated for use to create Flow Segments and flows

[Top](#top)

##  <a href="#templates" id="templates"></a>Templates 

*Requirements*
 * Create an Inbound and Outbound PDXC Templates for the new ServiceType

*Pre Requisites*
 * Maps need to be created (maps are not a prerequisite to start templates, they are a prerequisite to finalizing templates
 * Schemas
 * EndpointTypes

*Description*
* Create the inbound and outbound template for the new service type.
	* Inbound template must have the following values
		* Template name: Inbound_PDXC_REST_[ServiceType]
		* Service Type: [ServiceType]
		* Template Type: CISBaseInboundSync
		* Inbound Endpoint Type: Inbound PDXC REST
		* Transaction Groups:
		* "InboundReceive" and "InboundAckSend" must contains the follow transactions: Insert, Update and Close.
		* Select Inbound mapping and translation icon:
			* Select the source schema : [SchemaType][Dataconcept][Version]
			* Select the target schema: CISMessage.R1.0
			* Check in the Lock source schema, Lock target schema, Mark source as Boundary schema.
			* Inbound Mapping:
				Mapping Name: Lite[ServiceType]V2_To_CISMessage.R1.0
		* Select Outbound ACK Mapping icon:
			* Select the source schema: CISMessage.R1.0
			* Select the target schema: LiteResponse
			* Check in the Lock source schema, Lock target schema, Lock Mapping.
			* Outbound ACK Mapping:
				Mapping Name: CISMessage_To_LiteResponse.R1.0

	* Outbound template must have the following values
		* Template name: Outbound_PDXC_REST_[ServiceType]
		* Service Type: [ServiceType]
		* Template Type: CISBaseOutboundSync
		* Outbound Endpoint Type: Outbound PDXC REST
		* Transaction Groups:
		* "OutboundSend" and "OutboundAckReceive" must contain the following transactions groups: Insert, Update and Close.
		* Select Outbound Mapping and translation icon:
			* Select the source schema: CISMessage.R1.0
			* Select the target schema:  [SchemaType][Dataconcept][Version]
			* Check in the  Lock source schema, Lock target schema, Lock Mapping.
			* Outbound Mapping
				Mapping Name: CISMessage_To_Lite[ServiceType]V2.R1.0
		* Select Inbound ACK Mapping and Translation icon.
			* Select the source schema :  LiteResponse
			* Select the target schema: CISMessage.R1.0
			* Check in the  Lock source schema, Lock target schema, Mark source as Boundary schema.
			* Inbound ACK Mapping:
				Mapping Name: LiteResponse_To_CISMessage.R1.0

* Add the following information to the Rapid Deploy task
	* Template names
	* Set to "not custom" in the TemplatePublishType table
	* Set templates to active
	* For Catalog, it is imperative that NO OTHER templates are active but the two being added in this release.  There should be no others.

*Success Criteria*
* A flow can be created with the new inbound and outbound templates.
* A flow segment can be created with the new inbound and outbound templates
* When a user displays a flow or flow segment using the PDXC inbound and outbound templates, the boundary schema cannot be changed.  (the schema sent in or received from the source or target system cannot be modified to a different version of the standard message)
* A test result document is created and attached to this Jira
* Review by a TL

*Deliverables*
 * PDXC Inbound template for new service type
 * PDXC outbound template for new service type
 * Instructions in Rapid deploy for installing new template

*Outcome*
 * New inbound and outbound templates for Catalog exist so that the maps can be completed and then the flow segments and flows can be created.

 

[Top](#top)

##  <a href="#flowsegments" id="flowsegments"></a>Flow segments
*Requirement*

Create Flow Segment for ServiceType from ConnectNow

*Pre-Requisites*
 * Templates need to be created (Inbound_PDXC_REST_{ServiceType} and Outbound_PDXC_REST_{ServiceType})

*Description*


* Flow segments are created in the Public Tenant
	* Create Flow Segment for {ServiceType} from Existing Template - Inbound_PDXC_REST_{ServiceType}
		* Owner - DXC
		* Application - ConnectNow
		* Segment Name - {ServiceType}_from_PDXCConnectNow
		* Template Direction: Inbound
		* Template: Inbound_PDXC_REST_{ServiceType}

	* Create Flow Segment for {ServiceType} from Existing Template - Outbound_PDXC_REST_{ServiceType}
		* Owner - DXC
		* Application - ConnectNow
		* Segment Name - {ServiceType}_to_PDXCConnectNow
		* Template Direction: Outbound
		* Template: Outbound_PDXC_REST_{ServiceType}

* Add new Flow segment names to the SR Rapid Deploy Tasks

* Add steps to the ServiceRamp post deploy instructions 
	* List new flow segments that are created and indicate that they must be manually configured
	* Reuse existing ConnectNow inbound endpoint
	* Create New outbound ConnectNow endpoint in the DXC INTERNAL tenant
		* Endpoint Type - Outbound PDXC Rest
		* ServiceType - New ServiceType
		* Owner  - DXC
		* Application - ConnectNow
		* Ack Type - Synchronous
		* Attachment Type - Base64
		* Attachment Size - 9 MB
		* Obtain URL id/pw for ConnectNow for new ServiceType
* Publish new flow segments

*Success Criteria*
* When a flow is created for the {ServiceType}, the new flow segment(s) is available to be used in the flow and properly displays as "white".
* The newly created flow(s) can be tested end to end.
* Test results are created and attached to Jira.
* Review by a TL

*Deliverables*
* Inbound Flow Segment in ServiceRamp SandBox
* Outbound Flow Segment in ServiceRamp Sandbox
* Added notes to the SR Rapid Deploy Jira Task
* Added notes for the SR Manual Deploy Steps

*Outcome*
* Flow segments are ready for the Rapid Deploy to be completed

[Top](#top)

##  <a href="#rapiddeploysr" id="rapiddeploysr"></a>Rapid Deploy SR 

Pre Requisites:
* All artifacts are complete (schemas, maps, inbound services, flow segments, templates and lookup tables)
* All prior tasks have updated the Rapid Deploy task with the location and list of artifacts to include in the rapid deploy

Output:
* Creation of rapid_[ServiceType]_ebond package in Artifactory through pipeline.
* Using rapid_[ServiceType]_ebond package in Artifactory to deploy ServiceRamp in target ServiceRamp environments. 

Caveats:
* Endpoint information will not be exported since they contain information specific to a region/environment.

Naming Convention:

* Script file located in TFS with the following naming convention
	* somename...
* Install script located in TFS with the following naming convention
	* somename...

Success criteria:

 The ServiceRamp flows, inbound services, templates, mappings, schemas, and look up tables identified
* Identified the golden source where ServiceRamp artifacts can be exported. 
* Using ServiceRamp InitialImportAndCheck stored procedure identified all required import/export artifacts
* Ad-hoc SQL statements needed for CHANGE data type
* All ServiceRamp artifacts exported and zipped to a package
* Script prepared to import zipped content into new ServiceRamp environment


[Top](#top)

## Standard (Red Line) Tasks

##  <a href="#rschema" id="rschema"></a>Schema 
Pre-Requisites
* API Swagger documentation
> NOTE:  THIS TASK REQUIRES UPDATE TO SHOW ONLY WHAT IS REMAINING AFTER GREEN LINE DONE

Outputs from this step are:

* XSD for message format defined using specified criteria
* Data Contract 

Description:

* Create a xsd schema and apply manual changes to the xsd schema
* Add 10 extra (customer) fields to the schema
* Modify "simple" array structures to "complex" array structures as can be seen in [XSD](#xsd)
* Upload the xsd schema latest version to Sharepoint in the following folder: https://dxcportal.sharepoint.com/sites/IntegrationFramework/Inventory/00_Common/External/Schema/
* Check into TFS latest version of  xsd schema
	* $/CIS/Dev9.2/Schema/
* Generate the data contract using svcutil utility (link to svc util document) NOTE: Get Script Huahsin Powershell
* Check into TFS latest version of  data contract
	* $/CIS/Dev/Dev9.2/Shared/Contract/
* Generate from the Build Server the data contract dll.
* Update the CIS Rapid Deploy package task with the name of the Schema, Datacontract and path.
* Update the task for SR Rapid deployment with the name and path of the Schema XSD

 
Naming Convention Schema:

* [SchemaType][Dataconcept][Version]. Example:  LiteChangeV2

Naming Convention For Data Contract: 
* Hp.Cis.External.Canonical.DC.[SchemaName].cs

Success Criteria:

* The XSD needs to be stored in SR SB AWS (as a source resource)
* xsd matches the definition of the message to be used in PDXC ebonds and will successful serialize to JSON that matches
* Json resulted in the serialization needs to be able to deserializes back to XML
* Latest xsd is in sharepoint and TFS
* Latest data contract is in TFS
* CIS Rapid Deploy Task include latest data contract dll
* SR Rapid Deploy task includes the latest xsd
* Test Document created and uploaded to the Jira task
* Review by a tech lead


##  <a href="#rxsd" id="rxsd"></a>XSD
* ServiceRamp currently requires the schema to be defined in xsd format with the following special considerations

These are instructions to make changes to handle arrays for eBond schemas (i.e. LiteChangeV2, LiteIncidentV2, ...etc). Reason for changing the structure is two-fold:
 * The svcutil.exe will generate the datacontract without errors (otherwise it fails)
 * This JSON generated from the XML structure (using the datacontract) will match the JSON expected by ConnectNow. 

#### Wrong way for eBond lite schemas:

```xml
<xs:element name="affectedCis" maxOccurs="unbounded" minOccurs="0" type="xs:string">
```
 

#### Correct way for eBond lite schemas:

```xml
<xs:element name="affectedCis" minOccurs="0">
      <xs:complexType>
           <xs:sequence>
                 <xs:element maxOccurs="unbounded" minOccurs="0" name="string" type="xs:string" />
            </xs:sequence>
       </xs:complexType>
 </xs:element>
```

### DataContract
Use svcutil.exe to generate the datacontract.

[Top](#top)

##  <a href="#rinboundservice" id="rinboundservice"></a>Inbound Services

Pre Requisites

* Schema
* Need Engineer permission in Global tenant to create an inbound service in global tenant

Outputs:

* Inbound Services for new service type

Description:

* Create the Inbound Service in SR SB AWS
* List of test cases
* Test the Inbound Service
	* Use it in a flow, publish and send transactions E2E (Use SOAP, Then Rest, PUT and Post methods)
		
Naming Convention:

	GenericService+_+[SchemaName]
	
	Example:
		GenericService_LiteChangeV2
Success Criteria:

* Create the necessary InboundService in ServiceRamp AWS Sandbox
* Create for SOAP/Rest
* Request schema needs to match with XSD with the service type
* Need a sync (match with ICD) and Async (Generic Response) response schema
* Put and Post service operations.
* PUT method currently cant be configure trough SR UI. A manual change in the DB is needed to be added (Enhancement needed in the future).
* List the InboundService in the SR Rapid deployment Task 
* List the InboundService in the CIS Rapid deployment Task 
* Review from a TL
* Report with testing result. (Integration testing after deployed with CIS dacpac)
	

[Top](#top)


##  <a href="#rlookups" id="rlookups"></a>Lookups 

Pre Requisites
* Model document 
* Lookup Table Application Table Value Document

Outputs from this step are:

* Newly created Lookup tables per the ServiceType Design
* Updated values for application level lookup tables

Description:

* Generate in ServiceRamp AWS Sandbox the necessary Predefined and/or Application lookup tables according to the Model document
* Populate any Application Lookup table with appropriate values 
* Test the lookup table by using it in a flow, publish and make sure data translation occurs
* List test cases
	
Naming Convention:

* Predefined:
	* CIS+[DataConcept]+_+[Direction]+_+[Field]
	* Example:
		- CISChange_In_ChangeStatusPhase
		- CISChange_InOut_ChangeCategory 
* Application:
	* [Field]+_+[Direction]+_+Application
	* Example:
		- Company_InOut_Application 
		- Priority_In_Application 

Success Criteria:

* Create the necessary lookuptables in SR SB AWS 
* List the lookuptables in the SR Rapid deployment Task
* If an application lookuptable is updated add an Manual step to publish this table.
* Testing report document with the results of the testing.
* Review by a TL

[Top](#top)


##  <a href="#rmaps" id="rmaps"></a>Maps 
Pre requisites:

* Mapping Documents existing in Sharepoint that maps to and from the new service type and the CIS internal.
	* Inventory/00_Common/External/Schema
* Schemas from the new service type in question exists in Service Ramp SB AWS
* Lookup tables related to the Map exists in Service Ramp SB AWS
* LiteResponse_ToCISMessage and CISMessage_ToLiteResponse maps exists in Service Ramp

Outputs from this step are:

* Mapping for request schema for ServiceType to CIS Internal
    * Lite{ServiceType}V2 -> Canonical
* Mapping for CIS Internal to request schema for ServiceType
    * CIS Internal -> Lite{ServiceType}V2
 * Mapping for Lite Response should be verify (should already exists)
    * LiteResponse_To_CISMessage
* Inbound and outbound mapping for any response schema changes that are required for the new Service Type

Description:

* Create the to and from (between new service type and CIS Internal) maps in Service Ramp AWS Sandbox
Under Global Tenant using the template editor
	* Make sure Lookuptables are mapped
	* Map the Xtracustomerfields to extension
* From Service Ramp mapping screen, generate the XSLT of the two maps
* Check into TFS the XSLT maps
	* $/CIS/Dev/Dev9.2/Mapping/
* Generate from the Build Server the mapping dll and Test
	* Take a service type request map to Internal CIS
	* Take the result from step above and map back to service type and compare with the original.
* Include the mappings names in a CIS rapid deploy package task.
* Include the mapping names in a SR Rapid Deploy package task

Naming Convention:

* Output naming convention:
	* Lite[ServiceType]+[Version]+_+To+_+[TargetSchema]
	* Example: LiteIncidentV2_To_CISMessage
* Input naming convention:
	* [SourceSchema]+_+To+_+Lite[ServiceType]+[Version]
	* Example: CISMessage_To_LiteIncidentV2

Success Criteria:

* Map output matches the original after passing for both maps. 
	* Take a service type request and map to CIS Internal. Then take the result and map back to service type.
* Latest Maps XSLTs are in TFS
* SR Rapid Deploy task include latest  mapping name and location in TFS
* CIS Rapid Deploy task include latest  mapping name and location in TFS
* Test Document created and uploaded to the Jira task
* Review by a tech lead

[Top](#top)

##  <a href="#rtemplates" id="rtemplates"></a>Templates 

##  <a href="#templates" id="templates"></a>Templates 

Pre Requisites
* Maps need to be created (maps are not a prerequisite to start templates, they are a prerequisite to finalizing templates).
* Schemas
* EndpointTypes

Outputs

	* Inbound and Outbound template for the new service type 

Description:
	* Create the inbound and outbound template for the new service type.
	* Test the template by creating a Test flow with the template and do the necessary validations.
 
Success Criteria:
 
	* Inbound template must have the following values:
		* Properties: 
			* Template name:  Inbound_PDXC_REST_[ServiceType]
			* Service Type: [ServiceType]
			* Template Type:  CISBaseInboundSync
			* Inbound Endpoint Type: Inbound PDXC REST
			* Transaction Groups:
				* "InboundReceive" and "InboundAckSend" must contains the follow transactions: Insert, Update and Close.
			* Select Inbound mapping and Translation icon.
				* Select the source schema : [SchemaType][Dataconcept][Version]
				* Select the target schema: CISMessage.R1.0
				* Check in the Lock source schema, Lock target schema, Mark source as Boundary schema.
				* Inbound Mapping:
				  	Mapping Name: Lite[ServiceType]V2_To_CISMessage.R1.0
			* Select Outbound ACK Mapping and Translation icon.
				* Select the source schema: CISMessage.R1.0
				* Select the target schema: LiteResponse
				* Check in the Lock source schema, Lock target schema, Lock Mapping.
				* Outbound ACK Mapping:
					Mapping Name: CISMessage_To_LiteResponse.R1.0
			
	* Outbound template must have the following values:
		* Properties: 
			* Template name:   Outbound_PDXC_REST_[ServiceType]
			* Service Type: [ServiceType]
			* Template Type:  CISBaseOutboundSync
			* Outbound Endpoint Type: Outbound PDXC REST
			* Transaction Groups:
				* "OutboundSend"  and "OutboundAckReceive" must contains the follow transactions groups: Insert, Update and Close.
			* Select Outbound Mapping and translation icon.
				* Select the source schema: CISMessage.R1.0
				* Select the target schema:  [SchemaType][Dataconcept][Version]
				* Check in the  Lock source schema, Lock target schema, Lock Mapping.
				* Outbound Mapping
					Mapping Name: CISMessage_To_Lite[ServiceType]V2.R1.0
			* Select Inbound ACK Mapping and Translation icon.
				* Select the source schema :  LiteResponse
				* Select the target schema: CISMessage.R1.0
				* Check in the  Lock source schema, Lock target schema, Mark source as Boundary schema.
				* Inbound ACK Mapping:
					Mapping Name: LiteResponse_To_CISMessage.R1.0
	* Add Inbound_PDXC_REST_[ServiceType]  and Outbound_PDXC_REST_[ServiceType] in the SR Rapid Deployment Task.
	* Review by a TL
	* Testing result document.
	* Add a note in the Rapid deployment task that this templates needs to be activated by default.
	* Add the new template id to the TemplatePublishType table.	
	* Add the new Transaction in the TransactionType table.
	* Add the template reference in TemplateDrawingSelector table

[Top](#top)

##  <a href="#rflowsegments" id="rflowsegments"></a>Flow segments

Pre Requisites
* Templates need to be created (Inbound_PDXC_REST_[ServiceType] and Outbound_PDXC_REST_[ServiceType])
* Inbound services needs to be created.

Outputs:

* Flow Segment for ServiceType from ConnectNow
* Flow Segment for ServiceType to ConnectNow
* Nested Flow segment for ServiceType from APIGW
* Nested Flow segment for ServiceType to APIGW
* Nested Flow segment for ServiceType from CIS
* Nested Flow segment for ServiceType to CIS

Description:
* All flow segments are created in the public tenant
* Flow Segment for ServiceType from ConnectNow must have the following values:
	* Properties:
		* Flow Name {ServiceType}_from_PDXCConnectNow
		* Source Owner: DXC
		* Source Application: ConnectNow
		* Template: Inbound_PDXC_REST_{ServiceType}
		* Inbound Nested Flow Segment: {ServiceType}_from_APIGW
		* Outbound Nested Flow Segment: {ServiceType}_to_CIS
		* Inbound Service Definition: GenericService_{ServiceType}

* Flow Segment for ServiceType to ConnectNow must have the following values:
	* Properties:
		* Flow Name {ServiceType}_to_PDXCConnectNow
		* Target Owner: DXC
		* Target Application: ConnectNow
		* Template: Outbound_PDXC_REST_{ServiceType}
		* Inbound Nested Flow Segment: {ServiceType}_from_CIS
		* Outbound Nested Flow Segment: {ServiceType}_to_APIGW

* Nested Flow segment for ServiceType from APIGW must have the following values:
	* Properties:
		* Flow Name {ServiceType}_from_APIGW
		* Source Owner: DXC
		* Source Application: PDXC
		* Template: Inbound_PDXC_REST_{ServiceType}
		* Inbound Service Definition: GenericService_{ServiceType}

* Nested Flow segment for ServiceType to APIGW must have the following values:
	* Properties:
		* Flow Name {ServiceType}_to_APIGW
		* Target Owner: DXC
		* Target Application: ConnectNow
		* Template: Outbound_PDXC_REST_{ServiceType}
	* Transaction Groups:
		* Outbound Send:
			* Insert / Update / Close/ Resolve
			* Check the "Has Parameters" box
		* Outbound Ack Receive:
			* Insert / Update / Close/ Resolve
			* Do NOT check the "Has Parameters" box
	* Outbound Mapping
		* Parameter Group
			* Source Schema:  CISMessage
			* Target Schema:  Transport parameter
		* Mapping
			* Name:  APIGateway_Header (Shared Mapping)
			> This map should already exist and should be shared
			* Map Structure:
				* CISMessage->TransportParameter  
					* ->Headers(CreateElement)  
						* ->Header(CreateElement)  
						* [x-dxc-inf-customer] -> name (Constant)  
						* CustomerCode -> value(DirectMap)
						* ->Header(CreateElement)
							* [x-dxc-inf-route-key] -> name (Constant)
							* [Inbound] -> value (Constant)
		
* Nested Flow segment for ServiceType from CIS must have the following values:
		* Flow Name {ServiceType}_from_CIS
		* Source Owner: DXC
		* Source Application: PDXC
		* Template: Inbound_PDXC_REST_{ServiceType}
		* Inbound Service Definition: GenericService_{ServiceType}

* Nested Flow segment for ServiceType to CIS must have the following values:
	* Properties:
		* Flow Name {ServiceType}_to_CIS
		* Target Owner: DXC
		* Target Application: PDXC
		* Template: Outbound_PDXC_REST_{ServiceType}

* Publish a flow that uses this flow segments and test by sending a transaction E2E.

> Note:  Creation of these flow segments could someday be automated

Naming Convention
* Flow Segment: [ServiceType]_[from]_[PDXCConnectnow|ConnectNow]
* Flow Segment: [ServiceType]_[to]_[PDXCConnectnow|ConnectNow]
* Nested Flow Segment: [ServiceType]_[from]_[CIS]
* Nested Flow Segment: [ServiceType]_[to]_[CIS]
* Nested Flow Segment: [ServiceType]_[from]_[APIGW]
* Nested Flow Segment: [ServiceType]_[to]_[APIGW]
 
Success Criteria:
* All Flow Segments must be based on "Inbound_PDXC_REST__[ServiceType]" and "Outbound_PDXC_REST_[ServiceType]" templates.
* Flow segment must configured the correct inbound service and nested flow segments.
* Flow segment and nested flow segments must be created in Public Tenant.
* Include the new flow segments in SR Rapid Deployment Task.
* Include the APIGateway_Header map used in the {ServiceType}_to_APIGW flow segment in the SR Rapid Deployment Task.
* Include the manual steps task needed to create the necessary endpoints and publish the flow segments.
* Testing result document 
	* validate a transaction to APIGW with parameter headers
	* validate nested flow segment configuration by running a custom flow test (red-line)
	* validate standard strategic (green line) flow creation 
* Review by a TL

[Top](#top)

##  <a href="#rrapiddeploysr" id="rrapiddeploysr"></a>Rapid Deploy SR 

Pre Requisites:
* All artifacts are complete (schemas, maps, inbound services, flow segments, templates and lookup tables)
* All prior tasks have updated the Rapid Deploy task with the location and list of artifacts to include in the rapid deploy

Output:
* Zip file (??)
* Install script (??)
> Huahsin - need to know WHAT the output is specifically

Definition:
* use InitialImportAndCheck stored procedure to do something and get something
> Huahsin - need a list of activities done to create rapid deploy

Caveats:
* Endpoint information will not be exported since they contain information specific to a region/environment.

Naming Convention:

* Script file located in TFS with the following naming convention
	* somename...
* Install script located in TFS with the following naming convention
	* somename...

Success criteria:

* The ServiceRamp flows, inbound services, templates, mappings, schemas, and look up tables identified
* TIdentified the golden source where ServiceRamp artifacts can be exported. 
* TUsing ServiceRamp InitialImportAndCheck stored procedure identified all required import/export artifacts
* TAd-hoc SQL statements needed for CHANGE data type
* TAll ServiceRamp artifacts exported and zipped to a package
* TScript prepared to import zipped content into new ServiceRamp environment


[Top](#top)

##  <a href="#rrapiddeploycis" id="rrapiddeploycis"></a>Rapid Deploy CIS 

CIS Rapid Deploy

Follow instructions in [Share Point CISRapidDeployment documentation|https://dxcportal.sharepoint.com/:w:/s/IntegrationFramework/ETcr3D7ZCnROvGkW5CvyraoBB4cOkBsoy17H8MBxby0pew?e=VlKfXT] to group DataContract, Mapping, Schema, and deployment scripts C# codes into single Visual Studio project.

 Outputs from this steps are:
 * A single Visual Studio solution checked into TFS.  The contents of the solution should include:
 		* 2 VS projects for LiteChange & LiteResponse data contract ( can same LiteResponse delivered with LiteIncident be used here?).  The data contracts are generated from svcutil.exe utility.  
 		* 4 VS projects for mapping defined in mapping section [Create New ServiceType Maps|https://github.dxc.com/Platform-DXC/integration-serviceramp/blob/master/internal/docs/HOWTO_Create_New_ServiceType.md#maps].  The mappings are defined in ServiceRamp, exported as XSLT and included as .xslt file in the VS map project.
 		* 2 VS projects for Schema , LiteChange & LiteResponse (again LiteResponse needed every time?).  The schema, .xsd, files are uploaded in ServiceRamp.  The same .xsd files are used as project files.
 		* CIS\{rapid deploy version #}_NRT_RapidDeploy VS project that includes deployment PowerShell and any AD-HOC SQL scripts.
 *  TFS build defined to create rapid deployment installation .MSI file on command

The CIS Rapid Deploy solution can be built as schemas, mappings, look up table, ETC get developed.  As the unit and integration tests commences, it is preferred to build (compile) DLLs off of the VS build jobs.

Success Criteria includes:
* Projects can be built on demand and deployed to target servers
* Can be deployed into target environments multiple times
* Single execution scripts to deliver to L3

[Top](#top)

## Testing Tasks (will split to standard/vs custom later)

## <a href="#postdeploy" id="postdeploy"></a>Post API Deploy

This story has two subtasks.

### Parent Story

**Pre-Requisites:**

The [ServiceType] API has been deployed into the release pipeline.

**Outputs:**

* User permissions granted
* Standard routes in all AWS environments

**Description:**

* Grant user permissions to the ebdApiUser to access the [ServiceType] API in each supported AWS environment.
* Grant user permissions to the usercnebond1 user to access the [ServiceType] API in each supported AWS environment.
* Create the standard ServiceNow routes in each supported AWS environment to allow consumer access

**Naming Convention:**

RouteKeys are as follows:

|AWS Instance| RouteKey|
|---|---|
|US Domestic Sandbox<br>US Domestic DEV<br>US Domestic DEV2| serviceNowDev|
|US Domestic Test|serviceNowDevTest|
|US Domestic Stage|serviceNowDevQa|
|US Domestic Prod|serviceNow|
|Ireland Stage| serviceNowDevQa|
|Ireland Prod| serviceNow|
|Australia Stage|TBD|
|Australia Prod|TBD|

**Success Criteria:**

* The ebdApiUser has been granted access to the [ServiceType] API in each supported AWS environment
* The usercnebond1 user has been been granted access to the [ServiceType] API in each supported AWS environment
* The standard routes have been created in each supported AWS environment

 ### Subtask 1 - Grant API User Permissions in All Environments

 **Pre-requisites:**

* The [ServiceType] API  must be present in an AWS environment before permissions can be granted since the API name is validated.
* The ebdApiUser exists in the environment (this is created automatically during integration-aas deployments)
* The usercnebond1 user exists in the environment (this is manually created on-demand by the integration team)

**Outputs:**

 Updated user permissions.

**Description:**

Grant access to the new [ServiceType] API for standard users.

**Naming convention:**

N/A for this task.

**Success Criteria:**

* ebdApiUser has been granted access to the [ServiceType] API in all environments
* usercnebond1 has been granted access to the [ServiceType] API in all environments

 ### Subtask 2 - Create Standard ServiceNow Routes in All Environments

 **Pre-requisites:**

 * The [ServiceType] API must be deployed to an AWS environment before the route can be created
 * Credentials for the ServiceNow user are available for each environment (there is a pre-requisite task for this)
 * The RouteInfo URLs have been provided by the ServiceNow team

**Outputs:**

 Standard Routes in the infRoute table in each supported AWS Environment.

**Description:**

Create a Route in all environments to access the API.  Follow the sample conventions noted below.  Refer to the parent story for the RouteKey to be used in each environment. 

Validate the RouteInfo path and credentials.

Example:  US Domestic SANDBOX / DEV / DEV2
```
{code:java}
{
 "APIName": "Change",
 "SourceSystem": "",
 "RouteKey": "serviceNowDev",
 "RouteType": "http-proxy",
 "RouteRegion": "",
 "RouteAccount": "",
 "RouteRole": "",
 "RouteInfo": "https://cscdev.service-now.com/api/mpsc/dxc/change/R1",  <--update this for your specific service type>
 "RouteAuth": "Basic ZZZZZZZZZZZZZZZZ", <-- Base64 encoded pdxc.requestreply.api.gateway.integration userID/pwd
 "AuthParameter": {"authType": "basic"},
 "RouteLimitIP": "",
 "RouteDeliveryNetwork": ""
}
{code}
```

**Naming Conventions:**

Refer to the parent story for the RouteKey to be used in each environment. 

**Success Criteria:**

The standard routes have been created in each supported AWS Environment.

[Top](#top)

## <a href="#testprep" id="testprep"></a>Test Preparation

Pre Requisites:
* [PreRequisites](#prerequisite) are complete
* Rapid Deploys have been done to the target environment

Output:
* Inbound and Outbound flow in ServiceRamp using the GBP TestCompany 1 and depicting the strategic flow (green line)
* Inbound and Outbound flow in ServiceRamp using the GBP TestCompany 2 and depicting the custom flow (red line)

Definition:
* Creation of the four flows to depict the strategic and custom paths for ebonding will provide a way to test end-to-end the solution for the ServiceType.
* These flows are also critical to the test scripts

* Strategic Flow criteria:
	* Tenant
		* GBP Test Company 1
	* Inbound Flow:
		* use Inbound_PDXC_REST_[ServiceType] template
		* use [ServiceType]_to_PDXCConnectNow flow segment
	* Outbound Flow:
		* use [ServiceType]_from_PDXCConnectNow flow segment
		* use Outbound_PDXC_REST_[ServiceType] template

* Custom Flow criteria:
	* Tenant
		* GBP Test Company 2
	* Inbound Flow:
		* use Inbound_Custom_[ServiceType] template
		* use [ServiceType]_to_PDXCConnectNow flow segment
	* Outbound Flow:
		* use [ServiceType]_from_PDXCConnectNow flow segment
		* use Outbound_Custom_[ServiceType] template		

Publish flows and test end to end.

Naming Convention:

* Flows for Strategic should be named
	* NC1_to_ConnectNow and NC1_from_ConnectNow
* Flows for Custom should be named
	* NC2_to_ConnectNow and NC2_from_ConnectNow

Success criteria:

* All flows publish successfully
* All flows test end to end successfully
* Credentials to run flows are provided to test team
* Flows are exported and ready to import in next testing environment

[Top](#top)

## <a href="#testing" id="testing"></a>Testing

This activity has six stories associated with it.

### Story 1 - Define Test Data for Each Environment

**Pre-requisites:**

* The test data for [ServiceType] must be present in the ServiceNow environments
* ServiceNow Credentials to use for Testing in all supported ServiceNow environments must be available
* The ebdApiUser credentials should already exist in the AWS environments and can be obtained from EC2 or pulled via deploy.sh
* The DMW for [ServiceType] needs to be created

**Outputs:**

Postman Environment files for each supported AWS environment.

**Description:**

Obtain data specific to the [ServiceType] to utilize in the environment files for the Integration Tests.  The data is environment-specific and will need to be validated against each environment before the testing package can be released into the release-pipeline.  This data should be associated to a test company, not a live customer.

A single environment file should be created which supports both eBond and Request/Reply for a given [ServiceType] since the data overlaps.

**Naming Convention:**

There currently is no naming convention defined for the specific data points as we are using existing data for a test company.  If the need exists to directly onboard data in support of this task a naming convention should be documented for consistency and repeatability.  Onboarding of test data is included as a pre-requisite for any service type.

The output files will follow the [Postman Test Collection Standards|https://github.dxc.com/Platform-DXC/integration-aas/blob/master/docs/PostmanIntegrationTestStandards.md] naming conventions.

**Success Criteria:**

 * All [ServiceType] data points necessary to support testing for each supported ServiceNow environment have been obtained
 * Postman Environment files for each supported AWS environment have been created.  NOTE:  These file will have to be checked in with the Integration Test package rather than independently due to the way the packaging works in the integration-ebond repository.

### Story 2 - Add New User Credentials to SSM in all AWS Environments

>NOTE:  This task only applies if new credentials were created.  This is typically only required when a new eBond ServiceType is being introduced, and won't apply when Request/Reply is being implemented.

**Pre-requisites:**

* ServiceNow Credentials to use for Testing in all supported ServiceNow environments must be available

**Outputs:**

* Shell scripts for adding new entries into SSM in each AWS instance.  One script is needed for each supported AWS instance.
* SSM Parameter Store entries for all credentials used for testing.

>NOTE:  The scripts _cannot_ be stored in GitHub as that would expose the credentials and create a security violation.

**Description:**

Generate a shell script for each AWS environment which contains the Base64 encoded value for each new set of credentials required for testing.

The script command will follow this pattern:  
`aws ssm put-parameter --name ebd_<serviceType>_integration_user --type "SecureString" --value "cGR4Yy5zZXJ2aWNldHlwZS51c2VyOmJhZHB3ZA==" --overwrite`

The 'name' value will follow the naming convention specified below.

The 'value' will be the base64 endcoded `uid:pwd` value.

Provide the scripts to the infra-core team for implementation.  Note that the Integration Team can typically run the scripts against Sandbox and Infra-core is only needed for the higher environments.

**Naming Convention:**

The SSM value `name` should be prefixed with `ebd` and suffixed with `integration_user`.  The ServiceType value should be reflective of the actual user name.  For example, user `pdxc.change.integration` would use `change` for the serviceType value, resulting in `ebd_change_integration_user` as the `name` value for SSM.

**Success Criteria:**

 * All new credential values have been added to the SSM Parameter store in each supported AWS instance. 

### Story 3 - Define [ServiceType] Test Data for Each Environment

**Pre-requisites:**

* The test data for [ServiceType] must be present in the ServiceNow environments
* ServiceNow Credentials to use for Testing in all supported ServiceNow environments must be available.
* The ebdApiUser credentials should already exist in the AWS environments and can be obtained from EC2 or pulled via deploy.sh
* The DMW for [ServiceType] needs to be created

**Outputs:**

Postman Environment files for each supported AWS environment.

**Description:**

Obtain data specific to the [ServiceType] to utilize in the environment files for the Integration Tests.  The data is environment-specific and will need to be validated against each environment before the testing package can be released into the release-pipeline.  This data should be associated to a test company, not a live customer.

A single environment file should be created which supports both eBond and Request/Reply for a given [ServiceType] since the data overlaps.

**Naming Convention:**

There currently is no naming convention defined for the specific data points as we are using existing data for a test company.  If the need exists to directly onboard data in support of this task a naming convention should be documented for consistency and repeatability.  Onboarding of test data is included as a pre-requisite for any service type.

The output files will follow the [Postman Test Collection Standards|https://github.dxc.com/Platform-DXC/integration-aas/blob/master/docs/PostmanIntegrationTestStandards.md] naming conventions.

**Success Criteria:**

 * All [ServiceType] data points necessary to support testing for each supported ServiceNow environment have been obtained
 * Postman Environment files for each supported AWS environment have been created.  NOTE:  These file will have to be checked in with the Integration Test package rather than independently due to the way the packaging works in the integration-ebond repository.

### Story 4 - Create [ServiceType] API Integration Test - Postman Collection

**Pre-requisites:**

 * Test data and credentials for at least one ServiceNow environment should be available before proceeding, although it is possible to begin shelling out the collection while waiting on that information to be provided.
 * The DMW must be completed for the [ServiceType].
 * The [ServiceType] API must be deployed into AWS Sandbox.
 * ConnectNow and ServiceNow coding changes required to support the [ServiceType] must be completed and available in cscdev ServiceNow in order to support testing.

**Outputs:**

 A Postman collection and associated environment files for the [ServiceType].

**Description:**

* Prepare Integration Test Cases which cover all defined test cases
* Utilize environment files which cover all supported ServiceNow instances

**Naming Convention:**

Testing files should follow the standards in the [Postman Test Collection Standards|https://github.dxc.com/Platform-DXC/integration-aas/blob/master/docs/PostmanIntegrationTestStandards.md]

**Success Criteria:**

* The Integration Test collection performs testing of all defined test cases
* The Integration Test collection can successfully be run against all supported ServiceNow environments

### Story 5 - Create SOAP Test for [ServiceType]

**Pre-Requisites:**
 * Service Ramp flows must be available and published to support these requests. 
 * The [ServiceType] API must be published and working in the API Gateway for the selected test environment.

**Outputs:**

A Postman collection which can be used for making a successful SOAP call to the [ServiceType] API using a published ServiceRamp flow. 

**Description:**

Create a SOAP Test in POSTMAN which can call a flow in ServiceRamp and successfully create a [ServiceType] item in ServiceNow.

Examples and details can be found [here|https://github.dxc.com/Platform-DXC/integration-serviceramp/tree/master/testing/sanityTests].

**Naming Convention:**

 Follow the naming standards in the [Postman Test Collection Standards|https://github.dxc.com/Platform-DXC/integration-aas/blob/master/docs/PostmanIntegrationTestStandards.md].

**Success Criteria:**

 * A SOAP request can be successfully sent from Postman through the ServiceRamp flow for [ServiceType]
 * The ServiceNow [ServiceType] item is successfully created and all fields sent in with the request are present in the appropriate fields.
 * The Postman tests used for testing have been merged into Github (integration-serviceramp/testing/sanityTests)

### Story 6 - Create Integration Test Package and Update deploy.sh

**Pre-requisites:**

* The Postman Integration Test collections for [ServiceType] must be created and validated to be successfully in local testing.
* The environment files for each Supported ServiceNow environment for [ServiceType] must be validated to contain valid data during local testing.
* The [ServiceType] API must be deployed into the release pipeline (above DEV) before or in parallel with releasing the test package into the release-pipeline.

>NOTE:  For a **new** API, ensure the API package has been added to the release-pipeline so that is available in the TEST environment when the test package is marked stable.

**Outputs:**

 A tests-integration-api-core package in Artifactory which contains the tests for [ServiceType].

**Description:**

Files for this task are contained in the [integration-ebond|https://github.dxc.com/Platform-DXC/integration-ebond] repository.

The deployment guide for the integration-ebond repository test package can be found [here|https://github.dxc.com/Platform-DXC/integration-ebond/blob/master/docs/DeploymentGuide.md].

**Naming Convention:**

 * The Postman test collections have been named according to the [Postman Test Collection Standards|https://github.dxc.com/Platform-DXC/integration-aas/blob/master/docs/PostmanIntegrationTestStandards.md]. 
 * The Artifactory package must be named tests-integration-api-core.

**Success Criteria:**

 * The Changelog for tests-integration-api-core has been updated with details of the changes for incorporating [ServiceType] Tests
 * The major version for tests-integration-api-core has been incremented when a NEW collection is added.  If an existing collection is updated only the minor version will increment
 * The deploy.sh file has been updated to execute the test collections for [ServiceType]
 * The tests-integration-api-core package containing the [ServiceType] test collections is marked stable in Artifactory
 * The tests-integration-api-core package containing the [ServiceType] test collections has executed without error in all supported AWS instances.


[Top](#top)

##  <a href="#refintgpatterns" id="refintgpatterns"></a>Reference Integration Patterns Diagram 

![Diagram](images/Workshop-2018-08-IntegrationPatterns.PNG)

[Top](#top)
