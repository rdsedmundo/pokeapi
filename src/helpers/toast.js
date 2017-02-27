export default (() => {
  const delay = 3000;
  const el = document.createElement('div');
  el.classList.add('toast');

  document.body.appendChild(el);

  ////////////////////

  function isVisible() {
    return el.classList.contains('toast__visible');
  }

  function showMessage(msg, err) {
    if (err) {
      const stream = console;
      stream.warn('Handled error', err);
    }

    el.innerHTML = msg;

    if (!isVisible()) {
      el.classList.add('toast__visible');
    }

    window.setTimeout(() => {
      el.classList.remove('toast__visible');
    }, delay);
  }

  ////////////////////

  return {
    _: showMessage,
  };
})();
