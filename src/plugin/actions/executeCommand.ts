import { usePluginStore, useWatchEvent } from '@/hooks/plugin';

export default function (name: string) {
  const ActionID = `${window.argv[3].plugin.uuid}.${name}`;

  const plugin = usePluginStore();

  type ExecuteCommandSettings = {
    port?: number;
    command?: string;
  };

  const DEFAULT_SETTINGS: Required<ExecuteCommandSettings> = {
    port: 8787,
    command: 'workbench.action.showCommands'
  };

  const normalizeSettings = (raw: any): Required<ExecuteCommandSettings> => {
    const s: ExecuteCommandSettings = raw && typeof raw === 'object' ? raw : {};
    const portRaw = (s.port ?? DEFAULT_SETTINGS.port) as unknown;
    const portNum = typeof portRaw === 'number' ? portRaw : Number(portRaw);
    const port =
      Number.isFinite(portNum) && Math.trunc(portNum) >= 1 && Math.trunc(portNum) <= 65535
        ? Math.trunc(portNum)
        : DEFAULT_SETTINGS.port;
    return {
      port,
      command: typeof s.command === 'string' && s.command.trim() ? s.command.trim() : DEFAULT_SETTINGS.command,
    };
  };

  const wsUrlFromSettings = (settings: Required<ExecuteCommandSettings>) => `ws://127.0.0.1:${settings.port}`;

  type WsClient = {
    url: string;
    socket: WebSocket | null;
    queue: string[];
  };

  const clientsByUrl = new Map<string, WsClient>();

  const getClient = (url: string): WsClient => {
    const existing = clientsByUrl.get(url);
    if (existing) return existing;
    const client: WsClient = { url, socket: null, queue: [] };
    clientsByUrl.set(url, client);
    return client;
  };

  const ensureOpen = (client: WsClient) => {
    if (client.socket && (client.socket.readyState === WebSocket.OPEN || client.socket.readyState === WebSocket.CONNECTING)) return;

    try {
      const ws = new WebSocket(client.url);
      client.socket = ws;

      ws.onopen = () => {
        while (client.queue.length) {
          const msg = client.queue.shift();
          if (msg == null) continue;
          try {
            ws.send(msg);
          } catch {
            client.queue.unshift(msg);
            break;
          }
        }
      };
      ws.onclose = () => {
        if (client.socket === ws) client.socket = null;
      };
      ws.onerror = () => {
        // Let next send attempt reconnect.
      };
    } catch {
      client.socket = null;
    }
  };

  const sendOverWs = (url: string, message: string) => {
    const client = getClient(url);
    ensureOpen(client);
    if (client.socket && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(message);
      return;
    }
    client.queue.push(message);
    if (client.queue.length > 50) client.queue.splice(0, client.queue.length - 50);
  };

  const sendExecuteCommand = (context: string, device: string, rawSettings: any, source: string) => {
    const settings = normalizeSettings(rawSettings);

    if (!settings.command.trim()) {
      return;
    }

    const wsUrl = wsUrlFromSettings(settings);
    const payload = {
      type: 'executeCommand',
      command: settings.command,
      source,
      action: ActionID,
      context,
      device
    };

    try {
      sendOverWs(wsUrl, JSON.stringify(payload));
    } catch {
    }
  };

  const deviceByContext = new Map<string, string>();

  useWatchEvent('action', {
    ActionID,
    willAppear({ context, device }) {
      // Ensure defaults exist early; this also makes inspector UI populate with expected keys.
      const action = plugin.getAction(context);
      if (!action) return;
      if (typeof device === 'string' && device) deviceByContext.set(context, device);
      const normalized = normalizeSettings(action.settings);
      if (JSON.stringify(action.settings ?? {}) !== JSON.stringify(normalized)) {
        action.setSettings(normalized);
      }
      // Proactively connect to the VS Code extension WebSocket server so it can show "Connected"
      // without requiring the first key press.
      ensureOpen(getClient(wsUrlFromSettings(normalized)));
    },
    willDisappear({ context }) {
      deviceByContext.delete(context);
    },
    keyUp({ context, device }) {
      const action = plugin.getAction(context);
      if (!action) return;
      sendExecuteCommand(context, device, action.settings, 'keyUp');
    },
    sendToPlugin({ context, payload }) {
      const action = plugin.getAction(context);
      if (!action) return;
      if (!payload || typeof payload !== 'object') return;
      if (payload.type === 'testSend') {
        const device = deviceByContext.get(context) ?? '';
        sendExecuteCommand(context, device, action.settings, 'propertyInspector');
      }
    }
  });
}

