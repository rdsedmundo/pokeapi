<template>
  <main class="container-fluid p">
    <section class="row center-xs start-sm">
      <div class="col-xs-11 col-sm">
        <player
          :pokemons="pokemons"
          :bus="bus"
          team="p1"
        />
      </div>

      <div class="col-xs-11 col-sm">
        <player
          :pokemons="pokemons"
          :bus="bus"
          team="p2"
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
  .then(
    response => Vue.set(data, 'pokemons', response.data.results),
  )
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
