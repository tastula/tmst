import json

deps = dict()

with open("npmls.txt", "r") as depfile:
    active_dep = None
    for line in depfile.readlines():
        # Top-level dependency
        if len(line.split(" ")) == 2:
            active_dep = line.split(" ")[-1]
            deps[active_dep] = 0
        # Second-level dependency
        elif len(line.split(" ")) == 3:
            deps[active_dep] += 1

print(json.dumps(deps, indent=4))
