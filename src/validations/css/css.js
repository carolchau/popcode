var i18n = require('i18next-client');
var css = require('css');
var Promise = require('es6-promise').Promise;

var humanErrors = {
  "missing '}'": function() {
    i18n.t("css.missing-curly")
  },

  "property missing ':'": function() {
    i18n.t("css.property-missing-colon")
  },

  "selector missing": function() {
    i18n.t("css.selector-missing")
  }
};

function convertErrorToAnnotation(error) {
  if (humanErrors.hasOwnProperty(error.reason)) {
    var message = humanErrors[error.reason](error);
    return {
      row: error.line - 1, column: error.column - 1,
      raw: message,
      text: message,
      type: "error"
    };
  } else {
    console.warn("Couldn't find a human description for", error);
  }
};

module.exports = function(source) {
  var result = css.parse(source, {silent: true}).stylesheet;
  var annotations = [];
  result.parsingErrors.forEach(function(error) {
    var annotation = convertErrorToAnnotation(error);
    if (annotation !== undefined) {
      annotations.push(annotation);
    }
  });
  return Promise.resolve(annotations);
};
