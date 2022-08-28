# Memorize facts frontend

**Memorize facts frontend** is a project for an ofline-first cross-platform mobile app with optional sync to GraphQL server **Memorize facts backend**. It servers as a proof of concept. It is not intended to be used in production. App is not completed and you can face some bugs.

Written in React Native using [Expo](https://expo.dev/) and TypeScript. It also uses [RxDB](https://rxdb.info/) for offline-first database and GraphQL syncing. Components design is from [React Native Elements](https://reactnativeelements.com/) and forms are done with [Formik](https://formik.org/).

You can find the backend project [here](https://github.com/antonin-urban/memorize-facts-be).

## How to run
You can run the app in various ways, please check [Expo documentation](https://docs.expo.dev/) for more details.

For example, you can run the app on your phone using [Expo Go app](https://docs.expo.dev/workflow/run-on-device/).


## How to develop
Running
```bash
yarn start
```
will execute TypeScript compiler in watch mode and start Expo development server. Then you can, for example, connect your phone to the same network and run the app using Expo Go app. You can also run the app in emulators. Please check [Expo documentation](https://docs.expo.dev/) for more details.

Please note that you need to have [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) installed.

### GraphQL sync
If you want to sync to your own local instance of **Memorize facts backend**, you need to change the GraphQL server endpoint URL via `GQL_SERVER_URL` constant and located in `src/config.ts` file.