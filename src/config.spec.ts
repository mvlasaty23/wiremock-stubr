import { expect } from "chai";
import { parseConfig$ } from "./config";

describe('parseConfig$', () => {
  it('should parse the config', (done) => {
    parseConfig$('./config.yaml').subscribe((config) => {
      expect(config).is.not.null;
      done();
    });
  });
});