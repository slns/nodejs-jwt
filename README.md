# NodeJS-JWT
![](./images/logo_transparent.png)

#### Dependencies

##### Install dependencies
> npm install


#### Running project on development
> npm i -g nodemon

##### Open your Terminal/Shell and type:

> nodemon

After the command your application should start right in your default browser at localhost:3000

#### Test application on POSTMAN

##### Register New User
>POST - http://localhost:3000/api/register
In the body->raw put json

```
{
  "name": "Sergio Santos",
  "email": "sergio@example.com",
  "password": 123456
}
```
##### Login The user
> POST- http://localhost:3000/api/authenticate
In the body->raw put json

```
{
  "email": "sergio@example.com",
  "password": "123456"
}
```

##### One route to use the token
GET - http://localhost:3000/api/me
> In the HEADER put the key: Authorization and the value: Bearer THE-NEW-TOKEN
