var creds = {
  url: 'https://172.22.31.80',
  name: 'admin',
  pwd: 'col123col',
  token: '',
  urlToken: ''
}

var endpoints = {};

function classQuery(classname) {
  return $.ajax({
    url: creds.url + '/api/node/class/' + classname + '.json',
    headers: {
      'DevCookie': creds.token,
      'APIC-challenge': creds.urlToken,
      'Content-Type': 'application/json'
    }
  });
};

function login() {
  return $.ajax({
    type: 'POST',
    url: creds.url + '/api/aaaLogin.json?gui-token-request=yes',
    data: JSON.stringify({
      aaaUser: {
        attributes: {
          name: creds.name,
          pwd: creds.pwd
        }
      }
    }),
  });
};

function buildTableData(aci_endpoint_data) {
  table_data = []
  $.each(aci_endpoint_data['imdata'], function (i, endpoint) {  // for each endpoint in the data
    row = [ endpoint.fvCEp.attributes.mac, endpoint.fvCEp.attributes.ip ];  // build a row containing the endpoint's IP and MAC
    table_data.push(row);  // then add this entry to the end of the array
  });
  return table_data;
}

$( document ).ready(function() {
	
  login().then(function (data) {
    var attrs = data['imdata'][0]['aaaLogin']['attributes'];
    creds.token = attrs['token'];
    creds.urlToken = attrs['urlToken'];

    classQuery('fvCEp').then(buildTableData).then( function(table_data){
      $("#endpoint-table").DataTable({  // using jQuery to select the HTML element with ID='endpoint-table'
        data: table_data,               // and calling DataTable() to render the data
        columns: [                      // constructed from buildTableData()
          {title: "MAC Address"},
          {title: "IP Address"}
        ]
      })
    });
	
  });
  
});