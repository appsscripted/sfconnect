/*
 * OAuth 2.0 for Salesforce
 * Using OAuth2 for Apps Script - https://github.com/googlesamples/apps-script-oauth2 (Version 16)
 * And Salesforce Analytics API - http://www.salesforce.com/us/developer/docs/api_analytics/salesforce_analytics_rest_api.pdf
 
 * Prerequisites: 
 * 1. Must be run using the GAS Legacy Editor
 * 2. V8 Runtime is disabled in the GAS Editor
 * 3. OAuth2 Libary has been added to the GAS: 
 *   3.1. Click on the menu item "Resources > Libraries..."
 *   3.2. In the "Find a Library" text box, enter the script ID `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF` and click the "Select" button.
 *   3.3. Choose a version in the dropdown box (Version 16 has been verified as working as of 2/8/21).
 *   3.4. Click the "Save" button.
 
 * Steps to implement: 
 * 1. Create spreadsheet (or document) and paste this code in the associated script project
 * 2. Find the project's key (In GAS: File -> Project Properties -> Project Key
 * 3. Create a connected app in Salesforce with a callback URL https://script.google.com/macros/d/{PROJECT KEY}/usercallback (this requires Admin access)
 * 4. Get the Consumer Key and Consumer Secret and store them in the Script Properties (in the code below as "sfConsumerKey" and "sfConsumerSecret")
 * 5. Set the Project Key and Scope in the function getSfService() 
 * 6. Run the showSidebar() function and click the Authorization Url in the sidebar in your spreadsheet/document (reopen your script project if the sidebar doesn't appear)
 * 7. Login and approve the connected app
 
 * At this point the project has an access token that will expire within a certain time.  If your connected app does not have the "refresh_token" scope, you'll have to 
 * clear the service (clearService()) and repeats steps 6 and 7 in order to get another access token.  
 
 * While your access token is valid you can use it to request reports or make queries. Use makeRequest() and makeRequestSoql() to get data from Salesforce
 
 * If your connected app does have the "refresh_token" scope, use the refreshToken() function to update the access token
 */

// Create the Service
function getSfService() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return OAuth2.createService('salesforce')
    .setAuthorizationBaseUrl('https://login.salesforce.com/services/oauth2/authorize')
    .setTokenUrl('https://login.salesforce.com/services/oauth2/token')
    .setClientId(scriptProperties.getProperty("sfConsumerKey"))  // Added in Script Properties
    .setClientSecret(scriptProperties.getProperty("sfConsumerSecret"))  // Added in Script Properties
    .setProjectKey('YOUR PROJECT KEY')  // File > Project Properties
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('api refresh_token')  // https://help.salesforce.com/HTViewHelpDoc?id=remoteaccess_oauth_scopes.htm&language=en_US
}

// Open a sidebar in the spreadsheet (or document) that will create a link that will take the user authorize the app.
function showSidebar() {
  var sfService = getSfService();
  var test = sfService.hasAccess();
  if (!test) {
    var authorizationUrl = sfService.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    SpreadsheetApp.getUi().showSidebar(page);  // If you're using a Document, use DocumentApp instead of SpreadsheetApp
  } else {
    SpreadsheetApp.getActive().toast('Authorization already done.');  // If you're using a Document, use DocumentApp instead
  }
}

// This function is run after the link in the sidebar is clicked and the user authorizes the app. 
function authCallback(request) {
  var sfService = getSfService();
  var isAuthorized = sfService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

// This function clears the service
function clearService() {
  OAuth2.createService('salesforce')
  .setPropertyStore(PropertiesService.getUserProperties())
  .reset();
}
 

