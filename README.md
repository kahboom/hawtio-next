# Hawtio.next

[![Test](https://github.com/hawtio/hawtio-next/actions/workflows/test.yml/badge.svg)](https://github.com/hawtio/hawtio-next/actions/workflows/test.yml)
[![Lint](https://github.com/hawtio/hawtio-next/actions/workflows/lint.yml/badge.svg)](https://github.com/hawtio/hawtio-next/actions/workflows/lint.yml)

A Hawtio reimplementation based on TypeScript + React.
This project reimplements the following Hawtio JS components in one project:

- [hawtio-core](https://github.com/hawtio/hawtio-core)
- [hawtio-integration](https://github.com/hawtio/hawtio-integration)
- [hawtio-oauth](https://github.com/hawtio/hawtio-oauth)

## Development

This project was generated with [Create React App](https://create-react-app.dev/) and is managed through [CRACO](https://craco.js.org/) for customised Webpack configurations.

See also [Developing Hawtio.next](./docs/developing.md) for the project styling, guidelines, and more details on development.

### Prerequisites

You need to have installed the following tools before developing the project.

- [Node.js >= 16](https://nodejs.org/en/)
- [Yarn v3](https://yarnpkg.com/getting-started/install)

### Developing

After checking out the project, run the following command to set up the project dependencies.

```console
yarn install
```

To develop the project, run the following command and then open <http://localhost:3000/> in the browser.

```console
yarn start
```

Then run another Java application which has a Jolokia endpoint from a different terminal, and connect to it from the Connect tab in the Hawtio console. For example, you can run [this Spring Boot example](https://github.com/hawtio/hawtio/tree/main/examples/springboot) in background.

```console
mvn spring-boot:run
```

You can connect to this example at this Jolokia URL: <http://localhost:10001/actuator/hawtio/jolokia>

### Building

To build the project for production, run the following command. It's built into the `build/` directory.

```console
yarn build
```

### Testing

To execute the unit tests, run the following command.

```console
yarn test
```

### Linting

It is recommended to run linting against the code periodically with the following command.

```console
yarn lint
```
