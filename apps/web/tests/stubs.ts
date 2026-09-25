export const primevueStubs = {
  Card: {
    template: '<div><slot /><slot name="content" /></div>',
  },
  InputText: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    inheritAttrs: false,
    template: `
      <input
        :value="modelValue"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    `,
  },
  Button: {
    props: ['label'],
    inheritAttrs: false,
    template: '<button v-bind="$attrs">{{ label }}</button>',
  },
}