<template>
  <section class="autocomplete">
    <input
      v-model="input"
      :disabled="disabled"
      :title="title"
      @focus="setFocus(true)"
      @blur="setFocus(false)"
      @keydown="handleArrowControls"
      class="autocomplete__input"
      type="text"
      placeholder="Start typing for add an Pokemon..."
    />
    <transition name="fade">
      <div
        v-show="isFocused"
        class="autocomplete__suggestions"
      >
        <div
          v-for="(item, index) in filteredItems"
          v-html="item.displayName"
          :class="{ active: selectedIndex === index }"
          @mousemove="selectedIndex = index"
          @click="chooseItem"
          class="autocomplete__item p-"
        >
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { sanitizeName } from 'helpers/utils';

import * as methods from 'components/autocomplete/methods';

export default {
  name: 'auto-complete',
  props: [
    'items',
    'disabled',
  ],
  data() {
    return {
      input: '',
      selectedIndex: 0,
      isFocused: false,
    };
  },
  computed: {
    title() {
      return this.disabled ? 'You can\'t add more pokemons.' : '';
    },
    filteredItems() {
      if (!this.input) return [];

      return this.items
        .filter(item => (
          sanitizeName(item.name)
            .toLowerCase()
            .indexOf(this.input.toLowerCase()) >= 0
        ))
        .map((item) => {
          item.displayName = sanitizeName(item.name).replace(
            new RegExp(this.input, 'gi'),
            match => `<strong>${match}</strong>`,
          );

          return item;
        });
    },
  },
  methods: {
    ...methods,
  },
};
</script>

<style lang="scss">
@import './style.scss';
</style>
