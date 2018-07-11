import $ from 'jquery';

export default function () {

  const debugKey = 'debug';
  const debugKeyOutline = 'debug-outline';

  const STATUS_ENABLED = 'enabled';
  const STATUS_DISABLED = 'disabled';

  function debugStatusToggle(key) {
    if (localStorage.getItem(key) === STATUS_ENABLED) {
      localStorage.setItem(key, STATUS_DISABLED);
    } else {
      localStorage.setItem(key, STATUS_ENABLED);
    }
  }

  function getDebugStatus(key) {
    if (localStorage.getItem(key) === STATUS_ENABLED) {
      return true;
    }
  }

  if (getDebugStatus(debugKey)) {
    $('body').toggleClass('is-debug');
  }
  if (getDebugStatus(debugKeyOutline)) {
    $('body').toggleClass('is-debug-outline');
  }

  $(document).on('keydown', (e) => {
    if (e.altKey === true && e.shiftKey === true && e.ctrlKey === true) {
      $('body').toggleClass('is-debug');
      debugStatusToggle(debugKey);
    }
  });
  $('.js-toggle-debug-outline').on('click', () => {
    $('body').toggleClass('is-debug-outline');
    debugStatusToggle(debugKeyOutline);
    return false;
  });
}
