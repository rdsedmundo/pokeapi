<template>
  <section class="player h-100%">
    <div class="mt">
      <auto-complete
        @chooseItem="onChoosePokemon"
        :disabled="isDisabled"
        :items="pokemons"
      />
    </div>

    <div
      :class="[team]"
      class="player__information">
        <div class="wrapper">
          <div
            v-if="pokemonsList.length"
            class="player__currentpokemon p"
          >
            <div v-if="currentPokemon">
              <p class="player__pokemon-name pb---">{{ currentPokemon.name | sanitizeName }}</p>
              <p class="player__pokemon-health pb-">HP {{ currentPokemon.hp }} - A{{ attack }}</p>

              <select
                v-model="currentMove"
                @change="getMoveData"
              >
                <option
                  v-for="(move, index) in currentPokemon.moves"
                  :value="index"
                >
                  {{ move.move.name | sanitizeName }}
                </option>
              </select>
            </div>
            <div v-else>
              Choose an pokemon by clicking on it.
            </div>
          </div>

          <div class="player__pokemonslist">
            <transition-group name="list" tag="div">
              <pokemon
                v-for="pokemon in pokemonsList"
                @click.native="setCurrentPokemon(pokemon)"
                @dragstart.native="onDragStart(pokemon, $event)"
                @drop.native="onDrop"
                @dragover.native="onDragOver"
                @dead="onDead(pokemon)"
                @currentPokemon="setCurrentPokemon"
                :key="pokemon.id"
                :bus="bus"
                :team="team"
                :pokemon="pokemon"
                :data-id="pokemon.id"
                draggable="true"
              />
            </transition-group>
          </div>
        </div>
    </div>
  </section>
</template>

<script>
import debounce from 'lodash/debounce';
import { sanitizeName } from 'helpers/utils';
import AutoComplete from 'components/autocomplete';
import Pokemon from 'components/pokemon';

import * as methods from 'components/player/methods';

/* This is added for prevent layout breaking, because the number of pokemons
 * should be limited accordingly to current width of the window
*/
const mapMaxPokemons = () => {
  const maxWidth = window.innerWidth;

  if (maxWidth >= 1066) {
    return 12;
  }

  if (maxWidth >= 810) {
    return 9;
  }

  if (maxWidth >= 576) {
    return 8;
  }

  return 3;
};
const maxPokemons = mapMaxPokemons();
const listenToWindowResize = debounce(() => {
  if (maxPokemons !== mapMaxPokemons()) {
    location.reload();
  }
}, 1000);

export default {
  name: 'player',
  props: [
    'bus',
    'team',
    'pokemons',
  ],
  created() {
    window.addEventListener('resize', listenToWindowResize);
  },
  destroyed() {
    window.removeEventListener('resize', listenToWindowResize);
  },
  data() {
    return {
      maxPokemons,
      pokemonsList: [],
      currentPokemon: null,
      currentMove: 0,
      attack: 0,
    };
  },
  computed: {
    isDisabled() {
      return this.pokemonsList.length >= this.maxPokemons;
    },
  },
  watcher: {
    maxPokemons() {
      location.reload();
    },
  },
  components: {
    AutoComplete,
    Pokemon,
  },
  filters: {
    sanitizeName(value) {
      return sanitizeName(value);
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
