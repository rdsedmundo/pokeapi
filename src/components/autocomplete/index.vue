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
import keyCodes from 'helpers/key-codes';
import { sanitizeName } from 'helpers/utils';

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
    setFocus(value) {
      this.isFocused = value;
    },
    chooseItem() {
      if (!this.filteredItems.length) return;

      const selected = this.filteredItems[this.selectedIndex];

      this.input = '';
      this.$emit('chooseItem', selected.name);

      document.activeElement.blur();
    },
    handleArrowControls(event) {
      const key = event.which || event.keyCode;

      switch (key) {
        case keyCodes.ENTER: {
          this.chooseItem();

          event.preventDefault();
          break;
        }

        case keyCodes.ARROW_UP: {
          this.selectedIndex = Math.max(
            this.selectedIndex - 1,
            0,
          );

          event.preventDefault();
          break;
        }
        case keyCodes.ARROW_DOWN: {
          this.selectedIndex = Math.min(
            this.selectedIndex + 1,
            this.filteredItems.length - 1,
          );

          event.preventDefault();
          break;
        }

        default: {
          this.selectedIndex = 0;
          break;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.autocomplete {
  position: relative;
  z-index: 1000;

  &__input {
    width: 100%;
  }

  &__suggestions {
    position: absolute;
    width: 100%;
    max-height: 200px;
    overflow: auto;
  }

  &__item {
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: background-color .3s ease-in-out;

    &.active {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
}
</style>
