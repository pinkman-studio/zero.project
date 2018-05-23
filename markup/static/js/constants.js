export const HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': '*',
	'Access-Control-Allow-Headers': '*'
};


export const MEDIA_DESKTOP = window.matchMedia('screen and (min-width: 768px)').matches;
export const MEDIA_MOBILE = window.matchMedia('screen and (max-width: 767px)').matches;
