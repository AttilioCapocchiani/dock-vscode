<script setup lang="ts">
import { usePropertyStore, useWatchEvent, TabView } from '@/hooks/property';
import { useI18nStore } from '@/hooks/i18n';
import { NButton, NInput, NInputNumber } from 'naive-ui';

const i18n = useI18nStore();
const property = usePropertyStore();

useWatchEvent({
  didReceiveSettings() {},
  sendToPropertyInspector() {},
  didReceiveGlobalSettings() {}
});

type ExecuteCommandSettings = {
  port?: number;
  command?: string;
};

const defaults: Required<ExecuteCommandSettings> = {
  port: 8787,
  command: 'workbench.action.showCommands',
};

const port = computed<number>({
  get() {
    const s = (property.settings || {}) as ExecuteCommandSettings;
    const raw = (s.port ?? defaults.port) as unknown;
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n)) return defaults.port;
    const i = Math.trunc(n);
    if (i < 1 || i > 65535) return defaults.port;
    return i;
  },
  set(v) {
    const i = Math.trunc(typeof v === 'number' ? v : Number(v));
    const next = Number.isFinite(i) && i >= 1 && i <= 65535 ? i : defaults.port;
    property.settings = { ...(property.settings || {}), port: next };
  }
});

const command = computed<string>({
  get() {
    const s = (property.settings || {}) as ExecuteCommandSettings;
    return typeof s.command === 'string' ? s.command : defaults.command;
  },
  set(v) {
    property.settings = { ...(property.settings || {}), command: v };
  }
});

const testSend = () => {
  property.sendToPlugin({ type: 'testSend' });
};
</script>

<template>
  <div class="wrap">
    <TabView :label="i18n.port">
      <NInputNumber v-model:value="port" :min="1" :max="65535" placeholder="8787" />
    </TabView>

    <TabView :label="i18n.vscodeCommand">
      <NInput
        v-model:value="command"
        :placeholder="`${i18n.commandId}: workbench.action.showCommands`"
      />
    </TabView>

    <div class="btn-row">
      <NButton type="primary" @click="testSend">{{ i18n.testSend }}</NButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  padding: 10px 12px;
}

.btn-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>

