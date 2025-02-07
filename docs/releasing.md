# Releasing Hawtio.next packages

This document describes the release procedure for each package in Hawtio.next.

## Preliminary check

Before performing a release, first ensure that the project is ready for release by doing the following:

```console
yarn install

# lint
yarn format:check
yarn lint

# build & test
yarn build:all
yarn test:all
```

## Determining the target version to release

We follow [Semantic Versioning](https://semver.org/). That means the target version to increase to should be decided automatically based on the commit history since the last release.

The criteria for determining the target version is as follows:

- If the unreleased commit history has at least one commit with `feat:`, raise the **minor** version, e.g. `0.5.0` -> `0.6.0`
- If the unreleased commit history has no commits with `feat:`, raise the **patch** version, e.g. `0.5.0` -> `0.5.1`

> [!NOTE]
> Hawtio is a web UI console, so we normally think new features to the console are backward compatible. Thus, we raise the major version only when the project reaches an important milestone, requires major upgrades of some key components such as React and PatternFly in a backward compatible way, or needs to pivot the basic conditions of the project.

## Releasing @hawtio/react

To release the `@hawtio/react` package, follow these steps:

1. Run the following script to increase the `version` in [packages/hawtio/package.json](../packages/hawtio/package.json). It uses [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) internally to increase the version, creates a commit and a tag, and creates/updates the changelog.

   **Bump minor version:**

   ```console
   yarn release:hawtio --release-as minor
   ```

   **Bump patch version:**

   ```console
   yarn release:hawtio --release-as patch
   ```

2. Check that the commit and tag are made as expected:

   ```console
   git log -1
   git tag
   ```

   If not, revert the changes, fix the issue, and try the first step again.

3. Check the contents to be packaged before the actual release is made with `yarn pack` command.

   ```console
   $ yarn workspace @hawtio/react pack
   $ tar -tf packages/hawtio/package.tgz
   package/CHANGELOG.md
   package/LICENSE
   package/README.md
   package/dist/index.css
   package/dist/index.css.map
   package/dist/index.d.ts
   package/dist/index.js
   package/dist/index.js.map
   package/package.json
   ```

   Make sure to clean up the generated file after checking.

   ```console
   git clean -f
   ```

4. Publish the release.

   ```console
   yarn publish:hawtio
   ```

5. Push the commit and tag to the repository. The previous step doesn't automatically push changes to the repository, so don't forget to do this step.

   ```console
   git push <repo> main --tags
   ```

## Releasing other @hawtio/\<package-name\> packages

To release a `@hawtio/<package-name>` package, follow these steps:

1. Manually increase the `version` in packages/\<package-name\>/package.json. (Currently, we don't use any automation tool for increasing versions yet.)

   ```diff
    {
      "name": "@hawtio/<package-name>",
   -  "version": "1.0.0",
   +  "version": "1.1.0",
      "description": "...",
   ```

2. Commit the change and tag the version. Note we prefix `@hawtio/<package-name> v` to a version in commit messages and `<package-name>-v` to tags, since it is monorepo and different packages coexist in the single `main` branch.

   ```console
   git commit -m '@hawtio/<package-name> v1.1.0'
   git tag <package-name>-v1.1.0
   ```

3. Check the contents to be packaged before the actual release is made with `yarn pack` command.

   ```console
   $ yarn workspace @hawtio/<package-name> pack
   $ tar -tf packages/<package-name>/package.tgz
   package/LICENSE
   package/dist/index.d.ts
   package/dist/index.js
   package/package.json
   ```

   Make sure to clean up the generated file after checking.

   ```console
   git clean -f
   ```

4. Publish the release.

   ```console
   yarn workspace <package-name> npm publish --tolerate-republish
   ```

5. Push the commit and tag to the repository. The previous step doesn't automatically push changes to the repository, so don't forget to do this step.

   ```console
   git push <repo> main --tags
   ```
