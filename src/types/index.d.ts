declare namespace NodeJS {
  interface Process extends NodeJS.Process {
    browser?: boolean;
  }
}
