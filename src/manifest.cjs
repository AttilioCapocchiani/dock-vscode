const Plugin = {
  UUID: 'it.seggiola.vscdock',
  version: '1.0.0',
  Icon: 'images/icon.png',
  i18n: {
    en: {
      Name: 'VSCode Dock',
      Description: 'Control your VSCode from StreamDock'
    },
    it: {
      Name: 'VSCode Dock',
      Description: 'Controlla VS Code da StreamDock'
    },
    fr: {
      Name: 'VSCode Dock',
      Description: 'Contrôlez VS Code depuis StreamDock'
    },
    es: {
      Name: 'VSCode Dock',
      Description: 'Controla VS Code desde StreamDock'
    },
    pt: {
      Name: 'VSCode Dock',
      Description: 'Controle o VS Code a partir do StreamDock'
    }
  },
  Software: {
    MinimumVersion: "6.5"
  },
  ApplicationsToMonitor: {
    windows: [
    ]
  }
};

const Actions = [
  {
    UUID: 'executeCommand',
    Icon: 'images/icon.png',
    i18n: {
      en: {
        Name: 'Execute Command',
        Tooltip: 'Send a VS Code command over WebSocket'
      },
      it: {
        Name: 'Esegui comando',
        Tooltip: 'Invia un comando di VS Code tramite WebSocket'
      },
      fr: {
        Name: 'Exécuter une commande',
        Tooltip: 'Envoyer une commande VS Code via WebSocket'
      },
      es: {
        Name: 'Ejecutar comando',
        Tooltip: 'Enviar un comando de VS Code por WebSocket'
      },
      pt: {
        Name: 'Executar comando',
        Tooltip: 'Enviar um comando do VS Code via WebSocket'
      }
    },
    state: 0,
    States: [
      {
        FontSize: '10',
        TitleAlignment: 'bottom',
        Image: 'images/default.png'
      }
    ],
    Settings: {
      port: 8787,
      command: 'workbench.action.showCommands',
    },
    UserTitleEnabled: true,
    SupportedInMultiActions: false,
    Controllers: ['Keypad', 'Information']
  }
];

module.exports = { PUUID: Plugin.UUID, ApplicationsToMonitor: Plugin.ApplicationsToMonitor, Software: Plugin.Software, Version: Plugin.version, CategoryIcon: Plugin.Icon, i18n: Plugin.i18n, Actions };