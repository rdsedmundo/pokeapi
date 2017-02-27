<template>
  <div class="pokemon">
    <p class="pokemon__name">
      {{ name | sanitizeName }}
    </p>
    <p class="pokemon__health">HP {{ hp }} - A{{ attack }}</p>
    <img
      :src="sprites.front_default || 'http://placehold.it/96x96'"
      class="pokemon__avatar mb-"
    />

    <select
      v-model="choosenMove"
      @change="getMoveData"
    >
      <option
        v-for="move in moves"
        :value="move.move.name"
      >
        {{ move.move.name | sanitizeName }}
      </option>
    </select>
  </div>
</template>

<script>
import to from 'await-to-js';
import API from 'core/api';
import { sanitizeName } from 'helpers/utils';
import Toast from 'helpers/toast';

export default {
  name: 'pokemon',
  props: [
    'bus',
    'pokemon',
  ],
  created() {
    this.getMoveData();

    this.bus.$on('attack', (data) => {
      if (this.pokemon.id !== data.target) {
        return;
      }

      if (this.hp - data.attack.value <= 0) {
        this.$emit('dead', true);
        return;
      }

      this.hp -= data.attack.value;
    });
  },
  data() {
    return {
      ...this.pokemon,
      hp: 100,
      choosenMove: this.pokemon.moves[0].move.name,
      attack: 0,
    };
  },
  methods: {
    async getMoveData() {
      const [err, response] = await to(API.$.move.getDetails(this.choosenMove));

      if (err) {
        Toast._('Fail to get move data.', err);
        return;
      }

      this.attack = response.data.power * (response.data.accuracy / 100);
      this.$emit('setAttack', this.attack);
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
  padding: 5px 15px;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;

  &__name {
    color: white;
    font: {
      size: 1.8rem;
      weight: bold;
    }
  }

  &__health {
    color: white;
    font: {
      size: 1.4rem;
    }
  }

  &__avatar {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }
}
</style>
