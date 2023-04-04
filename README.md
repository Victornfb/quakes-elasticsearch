## Demo Elasticsearch - Quakes

1. Create/Start the docker instance of Elasticsearch.
```
docker compose up -d
```

2. Start the project.
```
pnpm start:dev
```

3. Ingest the data using the cURL below.
```
curl --location --request POST 'localhost:3000/search/ingest'
```

4. Now you can search for entries using the example below.
```
curl --location --request GET 'localhost:3000/search/earthquakes' \
--header 'Content-Type: application/json' \
--data '{
    "size": 50,
    "sort": [
        {
            "time": {
                "order": "desc"
            },
            "mag": {
                "order": "desc"
            }
        }
    ],
    "query": {
        "bool": {
            "filter": [
                {
                    "term": {
                        "type": "earthquake"
                    }
                },
                {
                    "range": {
                        "mag": {
                            "gte": 4
                        }
                    }
                },
                {
                    "match": {
                        "place": "Hawaii"
                    }
                }
            ]
        }
    }
}'
```