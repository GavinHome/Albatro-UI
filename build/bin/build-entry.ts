var Components = require('../../components.json');
var fs = require('fs');
var render = require('json-templater/string');
var uppercamelcase = require('uppercamelcase');
var path = require('path');
var endOfLine = require('os').EOL;

var OUTPUT_PATH = path.join(path.resolve("./"), 'packages/index.ts');
var IMPORT_TEMPLATE: string = 'import Al{{name}} from "~/{{package}}/index.ts";';
var INSTALL_COMPONENT_TEMPLATE: string = '  Al{{name}}';
var MAIN_TEMPLATE: string = `/* Automatically generated by './build/bin/build-entry.ts' */

import Vue from "vue";
{{include}}
import locale from "main/locale";
import AlCollapseTransition from "main/transitions/collapse-transition.js";

const components = [
{{install}},
  AlCollapseTransition
];

const install = function(vue: any, opts: any = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach((component: any) => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$ALBATRO = {
    size: opts.size || "",
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$dialog = AlDialog;
  Vue.prototype.$message = AlMessage;
};

export default {
  version: "{{version}}",
  locale: locale.use,
  i18n: locale.i18n,
  install,
  AlCollapseTransition,
  ...components
};
`;

delete Components.font;

var ComponentNames = Object.keys(Components);

var includeComponentTemplate: string[] = [];
var installTemplate: string[] = [];
var listTemplate: string[] = [];

ComponentNames.forEach(name => {
  var componentName = uppercamelcase(name);

  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name
  }));

  if (['Loading', 'Dialog', 'Message'].indexOf(componentName) === -1) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }));
  }

  if (componentName !== 'Loading') listTemplate.push(`  Al${componentName}`);
});

var template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  version: process.env.VERSION || require('../../package.json').version,
  list: listTemplate.join(',' + endOfLine)
});

fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:', OUTPUT_PATH);