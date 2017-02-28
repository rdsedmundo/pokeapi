<template>
  <div class="pokemon">
    <img
      :class="classObject"
      :src="image"
      :title="pokemon.name | sanitizeName"
      class="pokemon__avatar"
    />
  </div>
</template>

<script>
import { sanitizeName } from 'helpers/utils';
import Toast from 'helpers/toast';

export default {
  name: 'pokemon',
  props: [
    'bus',
    'pokemon',
    'team',
  ],
  data() {
    return {
      sufferedAttack: false,
    };
  },
  created() {
    this.$set(this.pokemon, 'hp', 200);

    this.bus.$on('attack', (data) => {
      if (this.pokemon.id !== data.target) {
        return;
      }

      if (this.pokemon.hp - data.attack.value <= 0) {
        this.$emit('dead', true);
        return;
      }

      this.sufferedAttack = true;
      this.pokemon.hp -= data.attack.value;
      this.$emit('currentPokemon', this.pokemon);

      window.setTimeout(() => {
        this.sufferedAttack = false;
      }, 3000);

      Toast._(`${sanitizeName(this.pokemon.name)} suffered a damage of ${data.attack.value}.`);
    });
  },
  computed: {
    classObject() {
      const animation = () => {
        const options = [
          'bounce',
          'flash',
          'flip',
          'headShake',
          'jello',
          'tada',
        ];

        return options[Math.floor(Math.random() * options.length)];
      };

      return {
        animated: this.sufferedAttack,
        [animation()]: this.sufferedAttack,
      };
    },
    image() {
      const sprites = this.pokemon.sprites;

      if (this.team === 'front' && sprites.front_default) {
        if (this.sufferedAttack && sprites.front_shiny) {
          return sprites.front_shiny;
        }

        return sprites.front_default;
      }

      if (sprites.back_default) {
        if (this.sufferedAttack && sprites.back_shiny) {
          return sprites.back_shiny;
        }

        return sprites.back_default;
      }

      return 'http://placehold.it/96x96';
    },
  },
  filters: {
    sanitizeName(value) {
      return sanitizeName(value);
    },
  },
};
</script>

<style lang="scss">
.pokemon {
  display: inline-block;
  text-align: center;
  cursor: pointer;

  &__avatar {
    animation-duration: 3s;
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }
}
</style>
