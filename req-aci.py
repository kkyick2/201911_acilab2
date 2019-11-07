import requests, json, pprint
from prettytable import PrettyTable

apic_ip = '172.22.31.80'
apic_username = 'admin'
apic_password = 'col123col'
credentials = {'aaaUser':
                {'attributes':
                    {'name': apic_username, 'pwd': apic_password }
                }
    }

base_url = 'https://%s/api/' % apic_ip
login_url = base_url + 'aaaLogin.json'

json_credentials = json.dumps(credentials)

post_response = requests.post(login_url, data=json_credentials, verify=False)

post_response_json = json.loads(post_response.text)
login_attributes = post_response_json['imdata'][0]['aaaLogin']['attributes']

cookies = {}
cookies['APIC-Cookie'] = login_attributes['token']

request_url = '/node/class/fvCEp.json'

response_data = requests.get(base_url + request_url, cookies=cookies, verify = False )

structured_data = json.loads(response_data.text)

fields = ['mac', 'ip', 'encap', 'dn']
data = []

for endpoints in structured_data['imdata']:
    for endpoint_data in endpoints['fvCEp'].items():
        line_dict={}
        for field in fields:
            line_dict[field] = endpoint_data[1][field]
        data.append(line_dict)

table = PrettyTable()
table.field_names = ['IP Address','MAC Address','Encap']
for row in data:
    table.add_row([row['ip'],row['mac'],row['encap']])

print(table)