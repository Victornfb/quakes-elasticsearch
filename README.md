## Demo Elasticsearch - NYC Accidents

1. Download the .csv file with the accidents data.
   - Go to the [NYC Open Data](https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95) page.
   - Click in "Export" than "CSV"

2. Install [Logstash](https://www.elastic.co/pt/downloads/logstash) to populate the Elasticsearch with the .csv file data.

3. Create the config file like below.
   - Obs.: the input > file > path `must` be an absolute path.
```
input {
  file {
    path => "/home/victor/Downloads/crashes.csv"
    start_position => "beginning"
  }
}
filter {
  csv {
    columns => ["crash_date", "crash_time", "borough", "zip_code", "latitude", "longitude", "location", "on_street_name", "cross_street_name", "off_street_name", "num_persons_injured", "num_persons_killed", "num_pedestrians_injured", "num_pedestrians_killed", "num_cyclist_injured", "num_cyclist_killed", "num_motorist_injured", "num_motorist_killed", "contributing_factor_vehicle_1", "contributing_factor_vehicle_2", "contributing_factor_vehicle_3", "contributing_factor_vehicle_4", "contributing_factor_vehicle_5", "collision_id", "vehicle_type_code_1", "vehicle_type_code_2", "vehicle_type_code_3", "vehicle_type_code_4", "vehicle_type_code_5"]
  }
}
output {
  elasticsearch {
    hosts => ["localhost:9200"] 
    index => "crashes"
  }
}
```

4. Create/Start the docker instance of Elasticsearch.
```
docker compose up -d
```

5. Execute the Logstash passing the config file.
```
sudo /usr/share/logstash/bin/logstash -f config.file
```

6. Start the project.
```
pnpm start:dev
```

7. Now you can search for entries using the examples below.
```
curl --location --request GET 'localhost:3000/search/crashes' \
--header 'Content-Type: application/json' \
--data '{
    "query": {
        "match": {
            "borough": "BROOKLYN"
        }
    }
}'
```

```
curl --location --request GET 'localhost:3000/search/crashes' \
--header 'Content-Type: application/json' \
--data '{
    "query": {
        "range": {
            "latitude": {
                "gte": 40,
                "lte": 41
            }
        }
    }
}'
```

```
curl --location --request GET 'localhost:3000/search/crashes' \
--header 'Content-Type: application/json' \
--data '{
    "query": {
        "bool": {
            "must": [
                {
                    "range": {
                        "num_persons_killed": {
                            "gte": 2
                        }
                    }
                },
                {
                    "match": {
                        "contributing_factor_vehicle_1": "speed"
                    }
                }
            ]
        }
    }
}'
```