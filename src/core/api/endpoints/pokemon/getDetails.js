import Endpoint from 'models/endpoint';

class GetPokemon extends Endpoint {
  getGroup() {
    return 'pokemon';
  }

  getName() {
    return 'getDetails';
  }

  call(name) {
    return this.get(`/pokemon/${name}/`);
  }
}

export default new GetPokemon();
