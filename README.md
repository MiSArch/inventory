# MisArch - Inventory Service
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Build with <a href="https://github.com/nestjs/nest" target="_blank">Nest.js</a> - A progressive framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

The inventory microservice keeps track of all available - or shipped product items.
It provides a Graphql API for general requests. Is processes events asynchronously from other MisArch services via Dapr Events.
For the full documentation visit the <a href="https://misarch.github.io/docs/docs/dev-manuals/services/inventory" target="_blank">MisArch Docs Page</a>.

## Installation
The service just requires docker. <a href="https://docs.docker.com/engine/install/" target="_blank">Installation Guide</a>

## Running the app
The service supports hot-reload when using the development docker file.
Any changes to the source code will lead to the service restarting.
```bash
$ docker compose -f docker-compose-dev.yaml up -d --build 
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

MisArch is [MIT licensed](LICENSE).
