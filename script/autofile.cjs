const path = require('path');
const fs = require('fs-extra');

const manifest = {};
const { PUUID, Actions, i18n, CategoryIcon, Version, Software, ApplicationsToMonitor } = require('../src/manifest.cjs');
console.log('[autofile] Starting automated build...');

// Dev build: reset dist and copy static assets.
if (process.argv[2] === 'dev') {
  fs.removeSync('./dist') || fs.mkdirSync('./dist') || fs.copySync('./public', './dist');
  fs.copyFileSync('./script/_.html', './dist/_.html');
}

// Build manifest actions
manifest.Actions = Actions.map((item) => {
  item.Name = item.i18n['en'].Name;
  item.Tooltip = item.i18n['en'].Tooltip;
  item.UUID = `${PUUID}.` + item.UUID;
  item.PropertyInspectorPath = process.argv[2] === 'dev' ? '_.html' : 'index.html';
  return item;
});
manifest.Version = Version;
manifest.Name = i18n['en'].Name;
manifest.Icon = CategoryIcon;
manifest.CategoryIcon = CategoryIcon;
manifest.Category = i18n['en'].Name;
manifest.Description = i18n['en'].Description;
manifest.CodePath = process.argv[2] === 'dev' ? '_.html' : 'index.html';

// Fixed metadata
manifest.SDKVersion = 2;
manifest.Author = 'MiraBox';
manifest.URL = 'http://video.hotspotek.com.cn/';
manifest.OS = [
  {
    Platform: 'mac',
    MinimumVersion: '10.11'
  },
  {
    Platform: 'windows',
    MinimumVersion: '7'
  }
];

// Generate localization files
Object.keys(i18n).forEach((item) => {
  const obj = {};
  obj.Name = i18n[item].Name;
  obj.Category = i18n[item].Name;
  obj.Description = i18n[item].Description;
  manifest.Actions.forEach((action) => {
    obj[action.UUID] = {
      Name: action.i18n[item].Name,
      Tooltip: action.i18n[item].Tooltip
    };
  });
  obj.Localization = {};
  fs.writeJSONSync(`./dist/${item}.json`, obj);
});

// Generate manifest.json
manifest.Actions = manifest.Actions.map((item) => {
  delete item.i18n;
  return item;
});
manifest.Software = Software;
manifest.ApplicationsToMonitor = ApplicationsToMonitor
fs.writeJSONSync('./dist/manifest.json', manifest, { spaces: 2, EOL: '\r\n' });

// Copy into StreamDock plugin folder
const PluginName = `${PUUID}.sdPlugin`;
console.log('pluginName is ', PluginName)
console.log('appdata is ', process.env.APPDATA)
const PluginPath = path.join('/Users/acapocchiani/Library/Application Support/', 'HotSpot/StreamDock/plugins', PluginName);
try {
  fs.removeSync(PluginPath) || fs.mkdirSync(PluginPath) || fs.copySync('./dist', PluginPath);
} catch (e) {
  console.warn('[autofile] Could not copy plugin to StreamDock folder:', PluginPath);
  console.warn('[autofile] You can manually copy ./dist ->', PluginPath);
  console.warn('[autofile] Error:', e && e.message ? e.message : e);
}
