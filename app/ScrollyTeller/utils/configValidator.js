import {
  forEach,
  isEmpty,
  isFunction,
  isObject,
  isUndefined,
} from 'lodash';
import ScrollyTellerNames from './ScrollyTellerNames';

export const exampleConfigObject = {
  appContainerId: 'sampleConfigId',
  /** can override the defaults in this class to customize CSS */
  cssNames: new ScrollyTellerNames(),
  /** build a list of story sections, keyed by sectionIdentifier.
   * Each section constructor should return a valid configuration,
   * or create a new section "object" outside, and add a .config() function
   * that returns a valid configuration object */
  sectionList: [
    {
      appContainerId: 'sampleConfigId', /** must be the same as the appContainerId above */
      sectionIdentifier: 'mySectionIdentifier',
      /** optional cssNames object if any CSS are overridden from the defaults
       * can override the defaults in this class to customize CSS */
      cssNames: new ScrollyTellerNames(),
      /** array of narration objects, OR a promise to return an array of narration objects.
       * See README for the specfication of the narration objects */
      // narration: d3promise.csv('app/...filePath.../narrationSectionSimple.csv'),
      narration: [{}],
      /** data in a form consumable by user specified buildGraphFunction method below,
       * OR a promise to return data. */
      data: { notEmpty: [] }, // data can't be empty
      /** promise example... */
      /** data: d3promise.csv('app/99_example_section_chart/data/dataBySeries.csv'), * */

      /** optional function to reshape data after queries or parsing from a file */
      reshapeDataFunction(data) { return data; },

      /**
       * Build graph in this function
       */
      buildGraphFunction() { /* build chart in this function */ },
      /**
       * Called whenever the document is scrolled. Handle scrolling in a function like
       * the one shown below
       * @param index - index of the narration block being activated
       * @param progress - progress from 0-1 of scrolling through that narration block
       * @param activeNarrationBlock - the DOM element representing the active narration block
       */
      onScrollFunction(index, progress, activeNarrationBlock) {
        /* handle scrolling in this function */
      },
      /**
       * Called when each narration block is activated. Handle in a function like
       * the one shown below
       * @param index - index of the narration block being activated
       * @param activeNarrationBlock - the DOM element representing the active narration block
       */
      onActivateNarrationFunction(index, activeNarrationBlock) {
        /* handle narration in this function */
      },

      /** optional flags to govern spacers and css behavior */

      /** set to true to show spacer sizes for debugging */
      showSpacers: true,
      /**  if false, you must specify your own graph css, where
       * the graph class name is "graph_section_ + sectionIdentifier" */
      useDefaultGraphCSS: true,
    },
    /** another section object like the one above can be added here... */
  ],
};


export function isPromise(value) {
  return Promise.resolve(value) === value;
}

function isANonEmptyObjectOrPromise(value) {
  const isAnObject = isObject(value) && !isEmpty(value);
  const isAPromise = isPromise(value);
  return (isAnObject || isAPromise);
}

function validateCSSNames(state) {
  const {
    cssNames,
  } = state;

  /** cssNames is optional, so allow ScrollyTeller to create the default ScrollyTellerNames object,
   * however, DO check for an incorrectly defined cssNames object
   * (not of class ScrollyTellerNames) */
  if (cssNames && (cssNames.constructor.name !== 'ScrollyTellerNames')) {
    throw Error('ScrollyTeller.validateSectionConfig() ' +
      'cssNames must be a ScrollyTellerNames object.');
  }
}

export function validateSectionConfig(sectionConfig) {
  /** validate each array configuration object */
  const {
    appContainerId,
    sectionIdentifier,
    narration,
    data,
    buildGraphFunction,
    onScrollFunction,
    onActivateNarrationFunction,
    showSpacers,
    useDefaultGraphCSS,
  } = sectionConfig;

  /** need a valid app container id */
  if (isUndefined(appContainerId)) {
    throw Error('ScrollyTeller.validateSectionConfig() missing ' +
      `appContainerId for section: ${sectionIdentifier}.`);
  }

  /** must have a valid section identifier */
  if (isUndefined(sectionIdentifier) || !sectionIdentifier.length) {
    throw Error('ScrollyTeller.validateSectionConfig() sectionArray is empty.');
  }

  validateCSSNames(sectionConfig);

  /** narration and data must be either arrays of objects or promises */
  if (!isANonEmptyObjectOrPromise(narration)) {
    throw Error('ScrollyTeller.validateSectionConfig() narration must be an array or a promise.');
  }

  if (!isANonEmptyObjectOrPromise(data)) {
    throw Error('ScrollyTeller.validateSectionConfig() data must be an array or a promise.');
  }

  /** reshapeData data is an optional function, so don't require it */

  /** must have implemented the following functions */
  if (!isFunction(buildGraphFunction)) {
    throw Error('ScrollyTeller.validateSectionConfig() buildGraphFunction must be a function.');
  }
  if (!isFunction(onScrollFunction)) {
    throw Error('ScrollyTeller.validateSectionConfig() onScrollFunction must be a function.');
  }
  if (!isFunction(onActivateNarrationFunction)) {
    throw Error('ScrollyTeller.validateSectionConfig()' +
      'onActivateNarrationFunction must be a function.');
  }

  /** must have a valid showSpacers flag */
  if (isUndefined(showSpacers)) {
    throw Error('ScrollyTeller.validateSectionConfig() sectionArray is empty.');
  }
  /** must have a useDefaultGraphCSS flag */
  if (isUndefined(useDefaultGraphCSS)) {
    throw Error('ScrollyTeller.validateSectionConfig() sectionArray is empty.');
  }
}

export function validateScrollyTellerConfig(state) {
  const {
    appContainerId,
    sectionList,
  } = state;
  /** need a valid app container id */
  if (isUndefined(appContainerId)) {
    throw Error('ScrollyTeller.validateScrollyTellerConfig() ' +
      'No appContainerId is set for the ScrollyTeller.');
  }

  /** need a valid array of sections */
  if (isEmpty(sectionList) || !isObject(sectionList)) {
    throw Error('ScrollyTeller.validateScrollyTellerConfig() sectionList is empty.');
  } else {
    validateCSSNames(state);

    forEach(sectionList, validateSectionConfig);
  }
}
