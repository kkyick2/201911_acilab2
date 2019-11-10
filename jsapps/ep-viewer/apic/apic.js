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

$( document ).ready(function() {
  login().then(function (data) {
    var attrs = data['imdata'][0]['aaaLogin']['attributes'];
    creds.token = attrs['token'];
    creds.urlToken = attrs['urlToken'];

    classQuery('fvCEp').then(function (data) {
      endpoints = data['imdata'];    // endpoints is an array of objects
      console.log('Total # of endpoints: ' + endpoints.length);
    });

  });
});