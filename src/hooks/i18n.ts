export const useI18nStore = () => {
  const languageRaw = window.argv[3].application.language as string | undefined;
  const language = (languageRaw || 'en').toLowerCase();
  const base = language.split(/[_-]/)[0];

  const strings: Record<string, Record<string, string>> = {
    en: {
      port: 'Port',
      vscodeCommand: 'VS Code command',
      commandId: 'Command ID',
      testSend: 'Test send'
    },
    it: {
      port: 'Porta',
      vscodeCommand: 'Comando di VS Code',
      commandId: 'ID comando',
      testSend: 'Invia test'
    },
    fr: {
      port: 'Port',
      vscodeCommand: 'Commande VS Code',
      commandId: 'ID de commande',
      testSend: 'Envoi de test'
    },
    es: {
      port: 'Puerto',
      vscodeCommand: 'Comando de VS Code',
      commandId: 'ID de comando',
      testSend: 'Enviar prueba'
    },
    pt: {
      port: 'Porta',
      vscodeCommand: 'Comando do VS Code',
      commandId: 'ID do comando',
      testSend: 'Enviar teste'
    }
  };

  return strings[base] || strings.en;
};
