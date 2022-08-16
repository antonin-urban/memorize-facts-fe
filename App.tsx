// for this first import see https://github.com/uuidjs/uuid/issues/416
import 'react-native-get-random-values';
import { decode, encode } from 'base-64';
import App from './src/App';

// RxDB polyfill to make it work with older browsers
if (!global.btoa) {
  global.btoa = encode;
}

// RxDB polyfill to make it work with older browsers
if (!global.atob) {
  global.atob = decode;
}

// RxDB polyfill to make it work with older browsers
// Avoid using node dependent modules
process.browser = true;

export default App;
