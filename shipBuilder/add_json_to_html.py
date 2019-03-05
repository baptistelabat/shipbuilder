import json

names = ['anthineas', 'DTMB_5415', 'KCS', 'OPV', 'MPOV', 'T0', 'T1']
data = {}
for name in names:
    with open(name + '.json') as f:
        data[name] = json.load(f)

with open("index.template.html", "r") as f:
    lines = f.readlines()

JSON = json.dumps(data)
lines = [line.replace('JSONDATA', JSON) for line in lines]

with open("index.template.json.html", "w") as f:
    f.writelines(lines)
