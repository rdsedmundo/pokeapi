import Endpoint from 'models/endpoint';

class GetMove extends Endpoint {
  getGroup() {
    return 'move';
  }

  getName() {
    return 'getDetails';
  }

  call(id) {
    return this.get(`/move/${id}/`);
  }
}

export default new GetMove();
