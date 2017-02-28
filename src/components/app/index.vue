<template>
  <main class="container-fluid ph h-100vh">
    <section class="row center-xs start-sm h-100%">
      <div class="col-xs-11 col-sm">
        <player
          :pokemons="pokemons"
          :bus="bus"
          team="back"
        />
      </div>

      <div class="col-xs-11 col-sm">
        <player
          :pokemons="pokemons"
          :bus="bus"
          team="front"
        />
      </div>
    </section>
  </main>
</template>

<script>
import Vue from 'vue';
import API from 'core/api';
import Player from 'components/player';
import Toast from 'helpers/toast';

const data = {
  pokemons: [],
  bus: new Vue(),
};

API.$.pokemon.getAll()
  .then(response => Vue.set(data, 'pokemons', response.data.results))
  .catch(Toast._.bind(null, 'Something went wrong'));

export default {
  name: 'app',
  data() {
    return data;
  },
  components: {
    Player,
  },
};
</script>
