# Backend Challenge - Products Manager

## About

The goal is to develop a scalable system for bulk uploading products via csv files and CRUD operations of those products in the database. The infrastructure of the solution consists of a Restful API made in nodeJS where you can upload files and request CRUD operations. These files are queued and products are added to the Postgres database from worker processes. The queue is a Redis instance and the files are uploaded to some cloud storage service, in this case we use AWS S3. The entire project runs in a local environment using Docker. The Minio container emulates the AWS S3 environment and would also work for Google Cloud Storage. The project's architecture was inspired by Uncle Bob's Clean Architecture concepts. The following diagram represents the suggested deployment on AWS services. The Elastic Container Service is used to automatically scale API containers and Workers as needed.

<p align="center">
  <img src="https://user-images.githubusercontent.com/13296861/175856555-b2a40885-203c-41fd-a6f4-d382d32d396f.png" />
</p>


## Technologies/Concepts

- Docker
- Redis
- postgreSQL
- Typescript
- NodeJS
- Express
- Bull
- Minio
- Clean Architecture

# Getting Started

- Rename the `.env.example` to `.env`.
- Start the local environment of the project with `docker-compose up`.
- Reinstall the dependencies with `sh dev-reinstall.sh`.
- Run the test environment with `sh run-all-tests.sh`.

# Available Endpoints

## Csv file upload

Csv file upload containing a list of products to be added to the database.

```
curl --request POST \
  --url http://localhost:5000/product-list \
  --header 'Content-Type: multipart/form-data' \
  --form 'csvFile=@{file_path}'
```

### Parameters

- `csvFile` (required): A file to upload using the `multipart/form-data` protocol.

### Returns

- `storageFilename`: generated name of the file stored on bucket.
- `jobId`: id of the job related to the file in the queue.

## Get Product List job status

Returns the status of the job in the queue.

```
curl --request GET \
  --url http://localhost:5000/product-list-status/:jobId
```

### Parameters

- `jobId` (required): id of the job related to the file in the queue.

### Returns

- `productListStatus`: status of the job in the queue. 
Possible values: `["waiting", "completed", "active", "failed", "delayed", "paused", "stuck", "notFound"]`

## Get all products

Returns all products from the database

```
curl --request GET \
  --url http://localhost:5000/products
```

### Returns

- Array with all products data

## Get product

Return data of single product from the database

```
curl --request GET \
  --url http://localhost:5000/product/:id
```

### Parameters

- `id` (required): id of the product.

### Returns

- Product data

## Remove product

Remove single product from the database

```
curl --request DELETE \
  --url http://localhost:5000/product/:id
```

### Parameters

- `id` (required): id of the product.

### Returns

- Only status code.

## Update product

Update single product from the database

```
curl --request PATCH \
  --url http://localhost:5000/product/:id \
  --header 'Content-Type: application/json' \
  --data '	{
		"lm": 1001,
		"name": "Furadeira X",
		"freeShipping": 0,
		"description": "Furadeira eficiente X",
		"price": 100,
		"category": 123123
	}'
```

### Parameters

- `id` (required): id of the product.
- `lm`
- `name`
- `freeShipping`
- `description`
- `price`
- `category`

### Returns

- Only status code.
