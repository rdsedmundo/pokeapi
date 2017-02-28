import to from 'await-to-js';
import API from 'core/api';
import Toast from 'helpers/toast';
import { sanitizeName } from 'helpers/utils';

export async function getMoveData() {
  const [err, response] = await to(
    API.$.move.getDetails(this.currentPokemon.moves[this.currentMove].move.name),
  );

  if (err) {
    Toast._('Fail to get move data.', err);
    return;
  }

  this.attack = response.data.power * (response.data.accuracy / 100);
}

export function onDead(who) {
  this.pokemonsList.splice(
    this.pokemonsList
      .map(p => p.name)
      .indexOf(who.name),
    1,
  );

  if (this.currentPokemon && who.id === this.currentPokemon.id) {
    if (!this.pokemonsList.length) {
      this.currentPokemon = null;
    } else {
      this.currentPokemon = this.pokemonsList[0];
    }
  }

  Toast._(`${sanitizeName(who.name)} died.`);
}

export function onDrop(event) {
  let attackData;

  try {
    attackData = JSON.parse(event.dataTransfer.getData('attack'));
  } catch (err) {
    return;
  }

  event.preventDefault();

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

export function onDragOver(event) {
  event.preventDefault();
}

export function onDragStart(pokemon, event) {
  if (!this.currentPokemon || this.currentPokemon.id !== pokemon.id) {
    event.preventDefault();
    Toast._(`Please, select ${sanitizeName(pokemon.name)} by clicking on it, before attacking.`);

    return;
  }

  if (!this.attack) {
    event.preventDefault();
    Toast._(`Please, choose an move for ${sanitizeName(this.currentPokemon.name)} with an power greather than 0 before attacking.`);

    return;
  }

  event.dataTransfer.setData('attack', JSON.stringify({
    team: this.team,
    value: this.attack,
  }));
}

export async function onChoosePokemon(name) {
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

/**
 * @param {Object} pokemon
 */
export function setCurrentPokemon(pokemon) {
  this.currentPokemon = pokemon;
  this.currentMove = 0;

  this.getMoveData();
}
