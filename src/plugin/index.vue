<script setup lang="ts">
import { useWatchEvent, usePluginStore } from '@/hooks/plugin';
Object.entries(import.meta.glob('@/plugin/actions/*.ts', { eager: true, import: 'default' })).forEach(([path, fn]) =>
  (fn as Function)(path.replace('/src/plugin/actions/', '').replace('.ts', ''))
);

const plugin = usePluginStore();
useWatchEvent('plugin', {
  // Keep empty; action logic subscribes to action-scoped events directly.
});
</script>

<template></template>

<style lang="scss" scoped></style>
