import keyCodes from 'helpers/key-codes';

/**
 * @param {Boolean} value
 */
export function setFocus(value) {
  this.isFocused = value;
}

export function chooseItem() {
  if (!this.filteredItems.length) return;

  const selected = this.filteredItems[this.selectedIndex];

  this.input = '';
  this.$emit('chooseItem', selected.name);

  document.activeElement.blur();
}

/**
 * @param {Event} event
 */
export function handleArrowControls(event) {
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
}
