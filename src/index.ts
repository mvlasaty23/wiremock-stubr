import { map } from 'rxjs/operators';
import { parseConfig$ } from './config';
import { Matcher, RequestConfig } from './model';

const CONFIG = 'config.yaml';

function wiremockMappingOf(
  priority: number,
  { method, url, bodyPatterns, response, queryParameters, headers, cookies }: RequestConfig
) {
  const mapping: Partial<any> = {
    priority,
    request: {},
    response: { ...response },
  };
  if (typeof url === 'string') {
    mapping.request = { method, url };
  } else {
    // assert(Object.entries(url).length === 1, 'Only one url can be specified');
    mapping.request = { method, ...url };
  }
  if (notEmpty(bodyPatterns)) {
    mapping['request']['bodyPatterns'] = Object.entries(bodyPatterns)
      .map(([patternKey, bodyPatterns]) => {
        if (bodyPatterns !== undefined) {
          return bodyPatterns.map((p) => {
            const pattern: { [k: string]: string } = {};
            pattern[patternKey] = p;
            return pattern;
          });
        }
        return [];
      })
      .reduce((prev, next) => [...prev, ...next], []);
  }
  if (notEmpty(queryParameters)) {
    mapping['request']['queryParameters'] = Object.entries(queryParameters)
      .map(toPatterns)
      .reduce((prev, next) => ({ ...prev, ...next }), {});
  }
  if (notEmpty(headers)) {
    mapping['request']['headers'] = Object.entries(headers)
      .map(toPatterns)
      .reduce((prev, next) => ({ ...prev, ...next }), {});
  }
  if (notEmpty(cookies)) {
    mapping['request']['cookies'] = Object.entries(cookies).map(toPatterns).reduce(patternObject, {});
  }
  return mapping;
}

function toPatterns([patternName, matcher]: [string, Matcher]): Record<string, Matcher> {
  const header: Record<string, Matcher> = {};
  header[patternName] = matcher;
  return header;
}
function patternObject(prev: Record<string, Matcher>, next: Record<string, Matcher>) {
  return { ...prev, ...next };
}

function notEmpty(obj?: Record<string, unknown>): obj is Record<string, unknown> {
  return obj !== undefined && Object.keys(obj).length > 0;
}

parseConfig$(CONFIG)
  .pipe(
    map((config) => config.stubs),
    map((stubs) =>
      Object.entries(stubs).map((stubRequests) =>
        Object.entries(stubRequests[1].requests).map((requestTuple) =>
          wiremockMappingOf(stubRequests[1].priority, requestTuple[1])
        )
      )
    )
  )
  .subscribe((config) => console.log(JSON.stringify(config, null, 2)));
