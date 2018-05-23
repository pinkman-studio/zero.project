import $ from 'jquery';

export default function () {
  $(document).on('keydown', (e) => {
    if (e.altKey === true && e.shiftKey === true && e.ctrlKey === true) {
      $('body').toggleClass('is-debug');
    }
  });
  $('.js-toggle-debug-outline').on('click', () => {
    $('body').toggleClass('is-debug-outline');
    return false;
  });
}
