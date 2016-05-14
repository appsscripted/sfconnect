function upload(object, payload) {
  var sfService = getSfService();
  var userProps = PropertiesService.getUserProperties();
  var props = userProps.getProperties();
  var name = getSfService().serviceName_;
  var obj = JSON.parse(props['oauth2.' + name]);
  var instanceUrl = obj.instance_url;
  var queryUrl = instanceUrl + "/services/data/v21.0/sobjects/" + object +"/";
  UrlFetchApp.fetch(queryUrl, {
    headers: {
      Authorization: "Bearer " + sfService.getAccessToken()
    },
    contentType: 'application/json',
    payload: payload,
    method: "POST"
  });
}

