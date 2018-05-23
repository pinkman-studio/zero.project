export default function svgInject() {
  window.config = {};

  window.config.svg = {
    root: '/static/img/',
    filename: 'svg-symbols.svg',
    revision: Math.floor(Math.random() * (20)),
  };

  const file = window.config.svg.root + window.config.svg.filename;
  const {
    config: {
      svg: {
        revision,
      },
    },
  } = window;


  if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
    return true;
  }

  const isLocalStorage = 'localStorage' in window && window.localStorage !== null;
  let request;
  let data;
  const insertIT = () => {
    document.body.insertAdjacentHTML('afterbegin', data);
  };
  const insert = () => {
    if (document.body) {
      insertIT();
    } else {
      document.addEventListener('DOMContentLoaded', insertIT);
    }
  };

  if (isLocalStorage && localStorage.getItem('inlineSVGrev') === revision) {
    data = localStorage.getItem('inlineSVGdata');
    if (data) {
      insert();
      return true;
    }
  }

  try {
    request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        data = request.responseText;
        insert();
        if (isLocalStorage) {
          localStorage.setItem('inlineSVGdata', data);
          localStorage.setItem('inlineSVGrev', revision);
        }
      }
    };
    request.send();
  } catch (e) {
    console.log(e);
  }
}
