<template>
  <section>
    <div class="pokemonsList">
      <pokemon
        v-for="pokemon in pokemonsList"
        :key="pokemon.id"
        :bus="bus"
        :pokemon="pokemon"
        :data-id="pokemon.id"
        @drop.native="onDrop"
        @dragstart.native="onDragStart"
        @dragover.native="onDragOver"
        @setAttack="setAttack"
        @dead="onDead(pokemon)"
        draggable="true"
      />
    </div>

    <div
      v-show="pokemonsList.length < MAX_POKEMONS"
      class="mt"
    >
      <auto-complete
        :items="pokemons"
        @chooseItem="onChoosePokemon"
      />
    </div>
  </section>
</template>

<script>
import to from 'await-to-js';
import API from 'core/api';
import Toast from 'helpers/toast';
import AutoComplete from 'components/autocomplete';
import Pokemon from 'components/pokemon';

export default {
  name: 'player',
  props: [
    'bus',
    'team',
    'pokemons',
  ],
  data() {
    return {
      MAX_POKEMONS: 3,
      pokemonsList: [],
      attack: 0,
    };
  },
  components: {
    AutoComplete,
    Pokemon,
  },
  methods: {
    setAttack,
    onDead,
    onDrop,
    onDragOver,
    onDragStart,
    onChoosePokemon,
  },
};

function setAttack(amount) {
  this.attack = amount;
}

function onDead(who) {
  this.pokemonsList.splice(
    this.pokemonsList
      .map(p => p.name)
      .indexOf(who.name),
    1,
  );
}

function onDrop(event) {
  event.preventDefault();

  const attackData = JSON.parse(event.dataTransfer.getData('attack'));

  if (this.team === attackData.team) {
    return;
  }

  let targetId = event.target.dataset.id;

  if (!targetId) targetId = event.target.parentNode.dataset.id;

  this.bus.$emit('attack', {
    target: Number(targetId),
    attack: attackData,
  });
}

function onDragOver(event) {
  event.preventDefault();
}

function onDragStart(event) {
  event.dataTransfer.setData('attack', JSON.stringify({
    team: this.team,
    value: this.attack,
  }));
}

async function onChoosePokemon(name) {
  this.pokemons.splice(
    this.pokemons
      .map(p => p.name)
      .indexOf(name),
    1,
  );

  const [err, response] = await to(API.$.pokemon.getDetails(name));

  if (err) {
    Toast._('Something went wrong.', err);
    return;
  }

  this.pokemonsList.push(response.data);
}
</script>

<style lang="scss">
.pokemonsList {
  min-height: 221px;
}
</style>
