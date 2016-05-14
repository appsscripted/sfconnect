/* I realized I used a very specific function to patch my records
   in the video, so below is one where you can set your own object
*/

function patchWidget(object, id, payload) {
  var sfService = getSfService();
  var userProps = PropertiesService.getUserProperties();
  var props = userProps.getProperties();
  var name = getSfService().serviceName_;
  var obj = JSON.parse(props['oauth2.' + name]);
  var instanceUrl = obj.instance_url;
  var queryUrl = instanceUrl + "/services/data/v21.0/sobjects/" + object +"/" + id;
  UrlFetchApp.fetch(queryUrl, {
    headers: {
      Authorization: "Bearer " + sfService.getAccessToken()
    },
    contentType: 'application/json',
    payload: payload,
    method: "PATCH"
  });
}
