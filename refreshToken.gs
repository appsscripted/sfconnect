// This function can be run periodically to replace an expired access token.  More details: https://help.salesforce.com/apex/HTViewHelpDoc?id=remoteaccess_oauth_refresh_token_flow.htm&language=en_US
function refreshToken() {
  var props = PropertiesService.getUserProperties();
  var uProps = JSON.parse(props.getProperties()['oauth2.salesforce']);  // assumes the service's name is "salesforce" (set when service was created)
  var sProps = PropertiesService.getScriptProperties();
  var clientId = sProps.getProperty('sfConsumerKey');
  var clientSecret = sProps.getProperty('sfConsumerSecret');
  var response = UrlFetchApp.fetch('login.salesforce.com/services/oauth2/token?grant_type=refresh_token&client_id=' + clientId + '&client_secret=' + clientSecret + '&refresh_token=' + uProps.refresh_token, {method: 'POST'});
  var nuProps = JSON.parse(response);
  uProps.signature = nuProps.signature;
  uProps.access_token = nuProps.access_token;
  uProps.issued_at = nuProps.issued_at;
  props.setProperty('oauth2.salesforce', JSON.stringify(uProps));
}
