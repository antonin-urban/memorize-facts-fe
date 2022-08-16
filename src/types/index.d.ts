declare module NodeJS {
  interface Process extends NodeJS.Process {
    browser?: boolean;
  }
}
