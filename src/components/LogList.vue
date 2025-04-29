<template>
    <div class="log-list">
        <ul>
            <li v-if="items.length" v-for="(item, index) in items" :key="index" :class="item.type">
                <span>{{ item.time }}</span>
                <span>{{ item.text }}</span>
            </li>
            <span class="empty" v-else>Логи отсутствуют</span>
        </ul>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['items'])


</script>

<style>
.log-list {
    width: min(100%, 1000px);
    margin: 1rem auto;
    height: 100%;
    max-height: 100%;
}

ul {
    list-style-type: none;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 100%;
    height: 100%;
    overflow-y: auto;
}

li {
    display: flex;
    gap: 8px;
    width: fit-content;
}

li>* {
    background-color: rgb(235, 235, 235);
    display: block;
    padding: 4px 12px;
    font-size: 1rem;
    border-radius: 2px;
    white-space: pre-wrap;
}

.info>* {
    outline: 1px solid rgb(107, 209, 235);
}

.error>* {
    outline: 1px solid rgb(235, 107, 107);
}

.success>* {
    outline: 1px solid rgb(107, 235, 107);
}

.empty {
    width: 100%;
    text-align: center;
    opacity: .75;
    letter-spacing: .0125rem;
}
</style>