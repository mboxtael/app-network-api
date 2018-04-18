This is a sample project built with the web framework Koa following the [best nodejs practices](https://github.com/i0natan/nodebestpractices). It includes a test suite built with Jest.

## Before start
Make sure do you have installed `docker` and `docker-compose`. To check if they are installed run in the command line:
```ruby
sudo docker -v
sudo docker-compose -v
```

_**The commands listing below run in `sudo` mode but if you have configured docker to run without `sudo`, you can run the commands without it.**_

## Build
### 1. Install dependencies
```ruby
sudo docker-compose run node yarn
```

### 2. Add .env file with required values
```yaml
DATABASE=mongodb://mongo/database_example
JWT_SECRET=some_secret_value
PORT_SERVER=3000 #default port
```

## Running
To run the project just do:
```ruby
sudo docker-compose up
```

## Testing
To run all tests suite:
```ruby
sudo docker-compose run node yarn test
```
