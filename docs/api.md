# To Do List API

Hello there. Thanks for using To Do List API. This documentation try to cover all To Do List API.

## Structure

The Envelope :

```json
{
  "meta": {
    "code": 200,
    "message": "API call successful.",
  },
  "data": ...
}
```
Error Response : 

```json
{
    "meta": {
        "code": 500,
		"status": "Error",
    },
    "data" : ...
}
```

### META
The meta key is used to communicate extra information about the response to the developer. If all goes well, you'll only ever see a code key with value 200. However, sometimes things go wrong, and in that case you might see a response like:

### DATA

The data key is the meat of the response. It may be a list or dictionary, but either way this is where you'll find the data you requested.

<aside class="notice">With the exception is OAuth2 API, that will explained later in Authorize section.</aside>

## Datatype
```json
{
  "meta": {
    "code": 200,
    "message": "Success."
  },
  "data": {
    "id": "5639ce5e778b5fa40148bed3",
    "number": 2,
    "username": "smittyfirst",
    "name": "Smitty Werben Jager man Jensen",
    "alive": false,
    "date": "2015-11-19 09:47:46.493Z"
  }
}
```
* Id or such will always be a string, even if it's look like a number. 

* Response with number will return number (ex. `1`, `322`), not quoted number.

* Respectively, bool will return `true` or `false`.

* Date will be returned as ISO 8601 string. Example `December 25th, 2015` will be sent as `"2015-12-25T00:00:00Z"`.


## Header

Use `appication/json` as `Content-Type` header. Even without it this API would not break, it's still a good practice.

Do note every API need you to provide either `access_token` or Authorization Header. Use following id and secret to generate correct header.

|Basic Auth|Public|
|-|-|
|ID|gitstest|
|Secret|gitstest|

|Bearer Token|User Access Token|
|-|-|
|Value|{{ refers to `access_token` in Login API ex : `c29504439314c5b072c665db8f2e9e650cc199ea` }}|



## Authentication

### Register

Request : 


* Link : POST {{ domain }}/api/v1/register

* Authorization : Basic Auth


|Field|Required|Value|
|-|-|-|
|email|yes|string|
|username|yes|string|
|password|yes|string|
|repassword|yes|string|

Success Response : 

```json
{
	"meta": {
		"code": 201,
		"message": "Successful Registered"
	},
	"data": "Link Email Verification has been sent to your Email, please check them"
}
```

Error Response : 

```
json
{
	"meta": {
		"code": 400,
		"message": "Email Already"
	},
	"data": "Email is already exist"
}
```



### Login
Request : 


* Link : POST {{ domain }}/api/v1/signin

* Authorization : Basic Auth

* Description : Login body Username by value `username` or `email` and body Password by `password` 

|Field|Required|Value|
|-|-|-|
|username|yes|string|
|password|yes|string|
  
Success Response : 

```json
{
	"meta": {
		"code": 201,
		"message": "Token Generated"
	},
	"data": {
		"user": {
			"email": "farhan.naufalghani@gmail.com",
			"username": "viercas",
			"__v": 0
		},
		"access_token": "f7af7f7f5ef56ae1818fcfd22010d1dc6e5ab3e6",
		"refresh_token": "e124bdd09b347777ad01eacbe754ae02ed64f6df",
		"accessTokenExpiresAt": "2017-09-19T10:26:29.826Z",
		"refreshTokenExpiresAt": "2017-10-03T09:26:29.826Z"
	}
}
```

Error Response : 

```json
{
	"meta": {
		"code": 400,
		"message": "Email or Username Invalid"
	},
	"data": "Email or Username Not Found or Invalid"
}
```

### Refresh Login
Request : 

* Description : If you got Token expired you can got new Token by serving `refresh_token`

* Link : POST {{ domain }}/api/v1/signin

* Authorization : Basic Auth

|Field|Required|Value|
|-|-|-|
|grant_type|yes|refresh_token|
|refresh_token|yes|string refers to `refresh_token` in Login module ex : `e7e1d4e8690f4d9dd8722e4a8e907664d49c3069`|

Success Response : 

```json
{
	"meta": {
		"code": 201,
		"message": "Token Generated"
	},
	"data": {
		"user": {
			"username": "viercas",
			"email": "farhan.naufalghani@gmail.com",
			"__v": 0
		},
		"access_token": "d729f267b458ec40a49cdf5b45a9c2a78308f32d",
		"refresh_token": "0c11c8dcf14afc30192d35efc59928db17ceb2c7",
		"accessTokenExpiresAt": "2017-09-28T11:55:25.575Z",
		"refreshTokenExpiresAt": "2017-10-12T10:55:25.575Z"
	}
}
```

Error Response : 

```json
{
	"meta": {
		"code": 400,
		"message": "Invalid"
	},
	"data": "Refresh Token Invalid"
}
```

### Forgot Password

Request : 


* Link : POST {{ domain }}/api/v1/forgotPassword

* Authorization : Basic Auth



|Field|Required|Value|
|-|-|-|
|email|yes|string|

Success Response : 

```json
{
	"meta": {
		"code": 201,
		"message": "SUCCESS"
	},
	"data": "Link forgot Password has been sent to Your Email"
}
```

Error Response : 

```json
{
	"meta": {
		"code": 404,
		"message": "404 Not Found"
	},
	"data": "Email not Found"
}
```

## TASK

### Get Task

Request : 


* Link : GET {{ domain }}/api/v1/task?priority={{ ascending or descending }}

* Authorization : Bearer Token


Success Response : 

```json
{
	"meta": {
		"code": 200,
		"message": "Success"
	},
	"data": [
		{
			"_id": "5a24dcbe46e9bb33f4c71a36",
			"user": "5a24d3227f94133520abb96c",
			"__v": 0,
			"timeStart": "2017-12-04T05:27:23.372Z",
			"location": "rancabolang",
			"priority": 1,
			"name": "task1"
		},
		{
			"_id": "5a24e179d3a98a24048d2258",
			"user": "5a24d3227f94133520abb96c",
			"__v": 0,
			"timeStart": "2017-12-04T02:47:00.000Z",
			"location": "rancabolang",
			"priority": 1,
			"name": "task1"
		},
		{
			"_id": "5a24e84b0307f20804c5fbc7",
			"user": "5a24d3227f94133520abb96c",
			"__v": 0,
			"timeStart": "2017-12-03T17:00:00.000Z",
			"location": "rancabolang",
			"priority": 2,
			"name": "task1"
		},
		{
			"_id": "5a24e4873dd63b22d0127796",
			"user": "5a24d3227f94133520abb96c",
			"__v": 0,
			"timeStart": "2017-12-04T02:47:00.000Z",
			"location": "wheres",
			"priority": 3,
			"name": "taskupdate"
		}
	]
}
```

Error Response : 

```json
{
	"meta": {
		"code": 401,
		"message": "Invalid Token"
	},
	"data": "Invalid token: access token is invalid"
}
```

### Create Task

Request : 


* Link : POST {{ domain }}/api/v1/task

* Authorization : Bearer Token



|Field|Required|Value|
|-|-|-|
|name|yes|string|
|location|yes|string|
|priority|yes|number|
|timeStart|yes|date|

Success Response : 

```json
{
	"meta": {
		"code": 201,
		"message": "Task Created"
	}
}
```

Error Response : 

```json
{
	"meta": {
		"code": 400,
		"message": "Missing"
	},
	"data": "Missing body parameter : name"
}
```

### Update Task

Request : 


* Link : PUT {{ domain }}/api/v1/task?task_id={{ refers to _id at Get Task ex : 5a24e4873dd63b22d0127799}}

* Authorization : Bearer Token



|Field|Required|Value|
|-|-|-|
|name|no|string|
|location|no|string|
|priority|no|number|
|timeStart|no|date|

Success Response : 

```json
{
	"meta": {
		"code": 201,
		"message": "Task Updated"
	}
}
```

Error Response : 

```json
{
	"meta": {
		"code": 400,
		"message": "Invalid Task ID"
	}
}
```

### Delete Task

Request : 


* Link : POST {{ domain }}/api/v1/task?task_id={{ refers to _id at Get Task ex : 5a24e4873dd63b22d0127799}}

* Authorization : Bearer Token



Success Response : 

```json
{
	"meta": {
		"code": 200,
		"message": "Task Deleted"
	}
}
```

Error Response : 

```json
{
	"meta": {
		"code": 400,
		"message": "Invalid Task ID"
	}
}
```