import {
  forEach,
  findIndex,
  isEmpty,
  isFunction,
  isObject,
  isString,
  isUndefined,
} from 'lodash';
import CSSNames from './CSSNames';

export function getFileExtensionFromURLString(url) {
  /** check for string */
  if (isString(url)) {
    /** regex match to get the file extension with 3 or 4 characters:
     * https://regex101.com/r/O5kD7y/1 */
    const matches = url.match(/\.(\w{3,4})$/g);
    return matches.length === 1 // multiple matches are probably invalid
      ? matches[0].replace('.', '') // strip off the . in .extension
      : '';
  }
  return '';
}

function isValidURLString(url) {
  const extension = getFileExtensionFromURLString(url);
  const index = findIndex(
    ['csv', 'tsv', 'json', 'html', 'txt', 'xml'],
    (valid) => { return valid === extension; },
  );
  return index !== -1;
}

export const exampleConfigObject = {
  /** The id of the <div> that will hold this and all other sections */
  appContainerId: 'myAppId',
  /** can override the defaults in this class to customize CSS */
  cssNames: new CSSNames(),
  /** build a list of story sections, keyed by sectionIdentifier.
   * Each section constructor should return a valid configuration,
   * or create a new section "object" outside, and add a .config() function
   * that returns a valid configuration object */
  sectionList: {
    exampleSectionIdentifier: {
      /** The id of the <div> that will hold this and all other sections */
      appContainerId: 'myAppId',

      /** identifier used to delineate different sections.  Should be unique from other sections
       * identifiers */
      sectionIdentifier: 'example',

      /** narration can be either of the following 3 options:
       *  1) a string representing an absolute file path to a file of the following types:
       *      'csv', 'tsv', 'json', 'html', 'txt', 'xml', which will be parsed by d3.promise
       *  2) array of narration objects,
       *  3) a promise to return an array of narration objects in the appropriate form
       * See README for the specfication of the narration objects */
      narration: 'demo_app/exampleSection1/data/narrationExampleSection1.csv',
      /** narration as array example */
      // narration: [ {}, ],
      /** narration as promise example */
      // narration: d3promise.csv('demo_app/exampleSection1/data/narrationExampleSection1.csv'),

      /** data can be either of the following 4 options:
       *  1) a string representing an absolute file path to a file of the following types:
       *      'csv', 'tsv', 'json', 'html', 'txt', 'xml', which will be parsed by d3.promise
       *  2) array of data objects
       *  3) a promise to return an array of narration objects in the appropriate form
       *  4) undefined
       */
      data: 'demo_app/exampleSection1/data/dataBySeries.csv',
      /** data as array example */
      // data: [ {}, ],
      /** data as promise example */
      // data: d3promise.csv('demo_app/exampleSection1/data/dataBySeries.csv'),

      /** optional function to reshape data after queries or parsing from a file
       * sectionConfig.data will be overwritten by this data array */
      reshapeDataFunction(data) { /** return reshaped data array to overwrite data */ },

      /**
       * Called AFTER data is fetched, and reshapeDataFunction is called.  This method should
       * build the graph and return an instance of that graph, which will passed as arguments
       * to the onScrollFunction and onActivateNarration functions.
       *
       * This function is called as follows:
       * buildGraphFunction(graphId, sectionConfig)
       * @param {string} graphId - id of the graph in this section. const myGraph = d3.select(`#${graphId}`);
       * @param {object} sectionConfig - the configuration object passed to ScrollyTeller
       * @param {object} [sectionConfig] - the configuration object passed to ScrollyTeller
       * @param {string} [sectionConfig.sectionIdentifier] - the identifier for this section
       * @param {object} [sectionConfig.graph] - the chart instance, or a reference containing the result of the buildChart() function above
       * @param {object} [sectionConfig.data] - the data that was passed in or resolved by the promise and processed by reshapeDataFunction()
       * @param {object} [sectionConfig.scroller] - the scrollama object that handles activation of narration, etc
       * @param {object} [sectionConfig.cssNames] - the CSSNames object containing some useful functions for getting the css identifiers of narrations, graph, and the section
       * @returns {object} - chart instance
       */
      buildGraphFunction(graphId, sectionConfig) { /** build and return myChart */ },

      /**
       * Called upon scrolling of the section. See argument list below, this function is called as:
       * onActivateNarration({ index, progress, element, trigger, graphId, sectionConfig })
       * @param {object} [params] - object containing parameters
       * @param {number} [params.index] - index of the active narration object
       * @param {number} [params.progress] - 0-1 (sort of) value indicating progress through the active narration block
       * @param {HTMLElement} [params.element] - the narration block DOM element that is currently active
       * @param {string} [params.trigger] - the trigger attribute for narration block that is currently active
       * @param {string} [params.graphId] - id of the graph in this section. const myGraph = d3.select(`#${graphId}`);
       * @param {object} [params.sectionConfig] - the configuration object passed to ScrollyTeller
       * @param {string} [params.sectionConfig.sectionIdentifier] - the identifier for this section
       * @param {object} [params.sectionConfig.graph] - the chart instance, or a reference containing the result of the buildChart() function above
       * @param {object} [params.sectionConfig.data] - the data that was passed in or resolved by the promise and processed by reshapeDataFunction()
       * @param {object} [params.sectionConfig.scroller] - the scrollama object that handles activation of narration, etc
       * @param {object} [params.sectionConfig.cssNames] - the CSSNames object containing some useful functions for getting the css identifiers of narrations, graph, and the section
       * @returns {void}
       */
      onScrollFunction({ index, progress, element, trigger, graphId, sectionConfig }) {},

      /**
       * Called when a narration block is activated.
       * See argument list below, this function is called as:
       * onActivateNarration({ index, progress, element, trigger, graphId, sectionConfig })
       * @param {object} [params] - object containing parameters
       * @param {number} [params.index] - index of the active narration object
       * @param {number} [params.progress] - 0-1 (sort of) value indicating progress through the active narration block
       * @param {HTMLElement} [params.element] - the narration block DOM element that is currently active
       * @param {string} [params.trigger] - the trigger attribute for narration block that is currently active
       * @param {string} [params.direction] - the direction the event happened in (up or down)
       * @param {string} [params.graphId] - id of the graph in this section. const myGraph = d3.select(`#${graphId}`);
       * @param {object} [params.sectionConfig] - the configuration object passed to ScrollyTeller
       * @param {string} [params.sectionConfig.sectionIdentifier] - the identifier for this section
       * @param {object} [params.sectionConfig.graph] - the chart instance, or a reference containing the result of the buildChart() function above
       * @param {object} [params.sectionConfig.data] - the data that was passed in or resolved by the promise and processed by reshapeDataFunction()
       * @param {object} [params.sectionConfig.scroller] - the scrollama object that handles activation of narration, etc
       * @param {object} [params.sectionConfig.cssNames] - the CSSNames object containing some useful functions for getting the css identifiers of narrations, graph, and the section
       * @returns {void}
       */
      onActivateNarrationFunction({ index, progress, trigger, direction, graphId, sectionConfig }) {},
    },
  },
  /** another section object like the one above can be added here... */
};


export function isPromise(value) {
  return Promise.resolve(value) === value;
}

function isANonEmptyObjectPromiseOrValidURLString(value) {
  const isURLString = isValidURLString(value);
  const isAnObject = isObject(value) && !isEmpty(value);
  const isAPromise = isPromise(value);
  return (isAnObject || isAPromise || isURLString);
}

function validateCSSNames(state) {
  const {
    cssNames,
  } = state;

  /** cssNames is optional, so allow ScrollyTeller to create the default CSSNames object,
   * however, DO check for an incorrectly defined cssNames object
   * (not of class CSSNames) */
  if (cssNames && (cssNames.constructor.name !== 'CSSNames')) {
    throw Error('ScrollyTeller.validateSectionConfig() cssNames must be a CSSNames object.');
  }
}

export function validateSectionConfig(sectionConfig) {
  /** validate each array configuration object */
  const {
    sectionIdentifier,
    narration,
    buildGraphFunction,
    onScrollFunction,
    onActivateNarrationFunction,
  } = sectionConfig;

  /** must have a valid section identifier */
  if (isUndefined(sectionIdentifier) || !sectionIdentifier.length) {
    throw Error('ScrollyTeller.validateSectionConfig() sectionArray is empty.');
  }

  validateCSSNames(sectionConfig);

  /** narration  must be either arrays of objects or promises */
  if (!isANonEmptyObjectPromiseOrValidURLString(narration)) {
    throw Error('ScrollyTeller.validateSectionConfig() narration must be an array or a promise.');
  }

  /** data can be undefined or empty */

  /** reshapeData data is an optional function, so don't require it */

  /** must have implemented the following functions */
  if (!isFunction(buildGraphFunction)) {
    throw Error('ScrollyTeller.validateSectionConfig() buildGraphFunction must be a function.');
  }
  if (!isFunction(onScrollFunction)) {
    throw Error('ScrollyTeller.validateSectionConfig() onScrollFunction must be a function.');
  }
  if (!isFunction(onActivateNarrationFunction)) {
    throw Error('ScrollyTeller.validateSectionConfig() onActivateNarrationFunction must be a function.');
  }
}

export function validateScrollyTellerConfig(state) {
  const {
    appContainerId,
    sectionList,
  } = state;
  /** need a valid app container id */
  if (isUndefined(appContainerId)) {
    throw Error('ScrollyTeller.validateScrollyTellerConfig() No appContainerId is set for the ScrollyTeller.');
  }

  /** need a valid array of sections */
  if (isEmpty(sectionList) || !isObject(sectionList)) {
    throw Error('ScrollyTeller.validateScrollyTellerConfig() sectionList is empty.');
  } else {
    validateCSSNames(state);

    forEach(sectionList, validateSectionConfig);
  }
}
