<template>
    <main>
        <FormPanel @submit="handleSubmit" @log="handleLog" />
        <LogList :items="logsData" />
    </main>
</template>

<script setup>
import FormPanel from './FormPanel.vue'
import LogList from './LogList.vue'
import { ref } from 'vue';


const logsData = ref([])
const handleLog = (text, type) => {
    // log time in HH:MM
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    // put new log message to the top of the list
    const newItem = {
        time: time,
        text: text,
        type: type,
    }
    logsData.value.unshift(newItem)
}
</script>

<style scoped>
main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>