<template>
    <form>
        <!-- visual for input queue -->
        <span class="change-order">Change Order: {{ changeOrder.join(' → ') }}</span>
        <span class="">counter {{ counter }}</span>
        <div class="inputs">
            <input v-for="(field, key) in fields" :key="key" type="number" :value="field.value"
                @input="(e) => debouncedHandleInput(key, e.target.value)" :placeholder="key" />
            <button :data-disabled=isSubmitting @click="handleSubmit">Ввод</button>
        </div>
        <div class="labels">
            <small v-for="(field, key) in fields">{{ key }}: {{ field.value }}</small>
            <pre>{{ localStorageContent || 'в хранилище пусто' }}</pre>
        </div>
    </form>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import { useDebounce } from '@/composables/useDebounce'


const emit = defineEmits(['log'])

const recalculatedText = ref('')
const counter = ref(0)
const changeOrder = ref([])
const localStorageContent = ref('')

const fields = {
    "цена": ref(0),
    "кол-во": ref(0),
    "сумма": ref(0),
}


// Load local storeage content on mount
onMounted(() => {
    if (localStorage.getItem('data')) {
        localStorageContent.value = JSON.parse(localStorage.getItem('data'))
    } else localStorageContent.value = null
})

// Form update logic

const handleInput = (fieldName, value) => {
    const numValue = Number(value)
    if (isNaN(numValue)) return
    // update form value
    fields[fieldName].value = numValue
    // update change order
    updateChangeOrder(fieldName)
    // update inputs queue
    recalculateDependentField(value)
    emit('log', `Значение ${fieldName.toUpperCase()} изменено на ${numValue}${recalculatedText.value}`, 'info')
}

// debounce input first via composable
const debouncedHandleInput = useDebounce(handleInput, 300)

// update queue of changed fields
const updateChangeOrder = (fieldName) => {
    if (!changeOrder.value.includes(fieldName)) {
        // new field - add to end
        changeOrder.value.push(fieldName)
    } else {
        // exist - move to end
        changeOrder.value = [
            ...changeOrder.value.filter(f => f !== fieldName),
            fieldName
        ]
    }
}

// recalculate very last input used if all other inputs are filled
// and update log message
const recalculateDependentField = (changedValue) => {
    recalculatedText.value = ''
    if (changeOrder.value.length === 0) return

    const dependentField = changeOrder.value[0] // first item in queue is last input changed
    const { цена, колво, сумма } = {
        цена: fields['цена'].value,
        колво: fields['кол-во'].value,
        сумма: fields['сумма'].value
    }

    if (dependentField === 'цена' && колво && сумма) {
        fields["цена"].value = (сумма / колво).toFixed(2)
    }
    else if (dependentField === 'кол-во' && цена && сумма) {
        fields['кол-во'].value = (сумма / цена).toFixed(2)
    }
    else if (dependentField === 'сумма' && цена && колво) {
        fields["сумма"].value = (цена * колво).toFixed(2)
    }
    // if queue is full - recalculating the last field is needed
    // udpate log message based on this
    if (changeOrder.value.length === Object.keys(fields).length && changedValue != 0) {
        recalculatedText.value = `, значение ${dependentField.toUpperCase()} автоматически изменено на ${fields[dependentField].value}`
    }

}

// handle submit 
const isSubmitting = ref(false)

const handleSubmit = (e) => {
    e.preventDefault();
    // check if all fields are filled
    if (Object.values(fields).some(field => field.value === 0)) {
        alert('Заполните все поля')
        return
    }
    // return if already submitting
    if (isSubmitting.value) return
    isSubmitting.value = true
    // prepare data object
    const data = {
        "counter": counter.value,
        "price": fields.цена.value,
        "qty": fields['кол-во'].value,
        "amount": fields['сумма'].value
    }
    // log in submission attempt
    emit('log', `Нажатие по "ВВОД", данные для отправки: ${JSON.stringify({ ...data })}, 
в localstorage сейчас: ${JSON.stringify({ ...localStorageContent.value })}`, 'info')

    // wait 1s before submitting form
    setTimeout(() => {
        const isSuccess = counter.value % 2 === 0
        if (isSuccess) {
            // save to local storage
            localStorage.setItem('data', JSON.stringify(data))
            localStorageContent.value = JSON.parse(localStorage.getItem('data'))
        }
        emit('log',
            `данные ${isSuccess ? 'БЫЛИ' : 'НЕ БЫЛИ'} сохранены, 
в localstorage сейчас: ${JSON.stringify({ ...localStorageContent.value })}`,
            isSuccess ? 'success' : 'error')

        isSubmitting.value = false
        counter.value++
    }, 1000)


}
</script>


<style>
form {
    display: flex;
    flex-direction: column;

    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #f0f0f0;
}

form>* {
    margin: 0 auto;
    display: grid;
    width: min(100%, 1000px);
    column-gap: 2rem;
    grid-template-columns: repeat(4, 1fr);

    * {
        width: 100%;
        max-width: 100%;
    }
}

pre {
    font-size: .9rem;
    color: #666;
    background-color: rgb(109, 109, 109);
    color: white;
    padding: 8px;
}

.change-order {
    column-span: 1 /4;
    display: block !important;
}

button {
    color: white;
    background-color: #353535;
    font-size: 1.25rem;
    transition: all 0.3s ease-in-out;
}

button:hover {
    background-color: black;
    cursor: pointer;
}

button[data-disabled="true"] {
    opacity: .25;
    cursor: not-allowed;
}
</style>