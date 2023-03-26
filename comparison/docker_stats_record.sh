#!/usr/bin/env bash

runtime="12 hours"
endtime=$(date -ud "$runtime" +%s)

# Based on https://github.com/sylhare/docker-stats-graph/blob/master/scripts/generate_data.sh
while [[ $(date -u +%s) -le ${endtime} ]]
do docker stats --no-stream --format "table {{.Name}};{{.CPUPerc}};{{.MemPerc}};{{.MemUsage}};{{.NetIO}};{{.BlockIO}};{{.PIDs}}" > dockerstats
tail -n +2 dockerstats | awk -v date=";$(date +%T)" '{print $0, date}' >> data.csv
sleep 10
done
rm dockerstats
