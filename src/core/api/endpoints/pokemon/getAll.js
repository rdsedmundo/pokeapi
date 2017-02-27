import Endpoint from 'models/endpoint';
import to from 'await-to-js';

class GetPokemon extends Endpoint {
  getGroup() {
    return 'pokemon';
  }

  getName() {
    return 'getAll';
  }

  async call() {
    const [error, response] = await to(this.get('/pokemon/'));

    if (error) {
      throw error;
    }

    return this.get(
      '/pokemon/',
      {
        params: { limit: response.data.count },
      },
    );
  }
}

export default new GetPokemon();
