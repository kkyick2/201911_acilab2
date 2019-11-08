import acitoolkit.acitoolkit as aci
import sys
import re
from prettytable import PrettyTable

# Create credentials
apic_ip = '172.22.31.80'
apic_username = 'admin'
apic_password = 'col123col'
apic_url = 'https://' + apic_ip

# Connect to fabric using ACI Toolkit
session = aci.Session(apic_url, apic_username, apic_password)
resp = session.login()

if not resp.ok:
    print("ERROR: Could not login into APIC: %s" % apic_ip)
    sys.exit(0)
else:
    print("SUCCESS: Logged into APIC: %s" % apic_ip)

# Pulling the endpoints from the fabric
endpoints = aci.Endpoint.get(session)
table_data = []

for endpoint in endpoints:
    if endpoint.if_dn:
        for dn in endpoint.if_dn:
            match = re.match('protpaths-(\d+)-(\d+)', dn.split('/')[2])
            if match:
                if match.group(1) and match.group(2):
                    interface = "Nodes: " + match.group(1) + "-" + match.group(2) + " " + endpoint.if_name
    else:
        interface = endpoint.if_name
    '''
    print("MAC:%s" % endpoint.mac)
    print("IP:%s" % endpoint.ip)
    print("Interface:%s" % interface)
    print("Encap:%s" % endpoint.encap)
    print("---------\n")
    '''
    table_row = { "MAC": endpoint.mac, "IP": endpoint.ip, "INT": interface, "ENCAP": endpoint.encap}
    table_data.append(table_row)

# Add pretty tables to the script
table = PrettyTable()
table.field_names = ['IP Address','MAC Address',"Interface","ENCAP"]
for row in table_data:
    table.add_row([row['IP'],row['MAC'],row['INT'],row['ENCAP']])

print(table)