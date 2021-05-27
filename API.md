# REST API
The sclient-server communication is based on the following API:

`<DATA>` is map that represent the csv file {`feature1` : `[value11, value12,...]`, `feature2` : `[value21, value22,...]`, ... }

## Upload train
### Request
`POST /api/model` with _query parameters:_ `model_type`: `regression` or `hybrid`, _Body:_ `{train_data: <DATA>}`
### Response
    HTTP/1.1 200 OK
    Date: Thu, 27 May 2021 14:33:59 GMT
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 74
    keep-alive: timeout=5
    x-powered-by: Express

    {"model_id":2,"upload_time":"2021-05-27T14:33:59.115Z","status":"pending"}
## Get model
### Request
`GET /api/model` with _query parameters:_ `model_id`: int
### Response
    HTTP/1.1 200 OK
    Date: Thu, 27 May 2021 14:40:51 GMT
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 72
    keep-alive: timeout=5
    x-powered-by: Express

    {"model_id":1,"upload_time":"2021-05-27T14:32:11.031Z","status":"ready"}
## Delete model
### Request
`DELETE /api/model` with _query parameters:_ `model_id`: int
### Response
    HTTP/1.1 200 OK
    Date: Thu, 27 May 2021 14:43:11 GMT
    Connection: keep-alive
    Content-Length: 0
    keep-alive: timeout=5
    x-powered-by: Express

    []
## Upload test
### Request
`POST /api/anomaly` with _query parameters:_ `model_id`: int, _Body:_ `{train_data: <DATA>}`
### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Date: Thu, 27 May 2021 14:46:24 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Length: 0

    []
## Get anomalies
### Request
`GET /api/anomaly` with _query parameters:_ `model_id`: int, `feature`: string
### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 63
    Date: Thu, 27 May 2021 14:46:24 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5


    {"feature":"slip-skid-ball_indicated-slip-skid","anomalies":[]}
