import fs from 'fs';
import * as yaml from 'js-yaml';
import { bindNodeCallback } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ServiceConfig } from './model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readFile$ = bindNodeCallback<string, any, string>(fs.readFile);
export function parseConfig$(file: string): Observable<ServiceConfig> {
  return readFile$(file, { encoding: 'utf8' }).pipe(
    map<string, ServiceConfig>((buffer) => yaml.load(buffer) as ServiceConfig)
  );
}
