// JQuery
interface JQuery {
  carousel(fn: string): any;
  slimScroll: any;
}

// Webpack
// declare function require(path: string);
declare const webpack: {
  ENV: string
};

declare var System: any;
