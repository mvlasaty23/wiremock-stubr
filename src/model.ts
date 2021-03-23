type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';

export type Matcher = Containing | Matching | EqualTo | EqualToJson;
export type MatcherKeys = keyof Containing | keyof Matching | keyof EqualTo | keyof EqualToJson;
interface Containing {
  contains: string;
}
interface Matching {
  matches: string;
}
interface EqualTo {
  equalTo: string;
}
interface EqualToJson {
  equalToJson: unknown;
}

export interface Context {
  request: { [key: string]: string };
  stub: { [key: string]: string };
  mapping: { [key: string]: string };
}
export interface ResponseConfig {
  status: number;
  header: { [headerName: string]: string };
}
export interface RequestConfig {
  url:
    | string
    | {
        urlPath?: string;
        urlPattern?: string;
        pathPattern?: string;
      };
  method: HttpMethod;
  queryParameters?: {
    [paramName: string]: Matcher;
  };
  headers?: {
    [headerName: string]: Matcher;
  };
  cookies?: {
    [cookieName: string]: Matcher;
  };
  bodyPatterns?: {
    [k in MatcherKeys]?: string[];
  };
  response?: ResponseConfig;
}

export interface ServiceConfig {
  context: Context;
  output: {
    baseDir: string;
    folderName: string;
    name: string;
  };
  response: ResponseConfig;
  stubs: {
    [serviceName: string]: {
      baseUrl: string;
      priority: number;
      requests: {
        [requestName: string]: RequestConfig;
      };
    };
  };
}
