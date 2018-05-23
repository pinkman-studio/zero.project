import $ from 'jquery';

export class Popup {
	constructor(props) {

		// initial Props
		this.props = {
			hideBtnClassName: null,
			showBtnClassName: null,
			body: document.getElementsByTagName('body')[0],
			bodyLockClassName: 'popup__scroll--locked',
			popupShowClassName: 'popup--show',
			popupPresentShowClassName: 'popup__present--show',
			popupVisuallyHiddenClassName: 'visually_hidden',
			popupRootClassName: 'popup',
			popupContentClassName: 'popup__content',
			popupPresentClassName: false,
			hideEventName: 'popupHide',
			btnParentClassName: null,
			excludeHideSelectorsArr: [],
			onCloseCallback: () => false,
			onOpenCallback: () => false,
			onInitCallback: () => false,
		};

		// assign new Props
		this.props = {
			...this.props,
			...props,
		};

		// initial State
		this.state = {
			bodyScrollTop: null,
			isBodyLock: false,
			isPopupShow: false,
			popupRoot: null,
			popupPresent: null,
			hideBtn: null,
			showBtns: [],
			flag: false,
			excludeHideSelectorsArr: ['.select2-container']
		};

	}

	setState(key, value) {
		if (key && value !== undefined) {
			Object.defineProperty(this.state, key, {
				value,
				configurable: true,
				writable: true,
				enumerable: true
			});
		} else {
			console.groupCollapsed('key & value - required');
			console.warn('key ', key);
			console.warn('value ', value);
			console.groupEnd();
		}
	}

	getState(key) {
		return this.state[key];
	}

	lockScroll() {
		const {
			props: {
				bodyLockClassName,
				body,
			},
			state: {
				isBodyLock,
			},
		} = this;

		if (!isBodyLock) {
			this.setState('bodyScrollTop', (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop);
			body.classList.add(bodyLockClassName);
			body.style.top = `-${this.getState('bodyScrollTop')}px`;
			this.setState('isBodyLock', true);
		}
	}

	unlockScroll() {
		const {
			props: {
				bodyLockClassName,
				body,
			},
			state: {
				isBodyLock,
			},
		} = this;

		const bodyScrollTop = this.getState('bodyScrollTop');

		if (isBodyLock) {
			body.classList.remove(bodyLockClassName);
			body.style.top = null;
			window.scrollTo(0, bodyScrollTop);
			this.setState('isBodyLock', false);
		}
	}

	excludeHideEvents(target) {
		const {
			state: {
				excludeHideSelectorsArr
			}
		} = this;
		let flag = true;
		excludeHideSelectorsArr.forEach((item) => {
			if (target.closest(item).length !== 0) {
				flag = false;
			}
		});
		return flag;
	}

	initHideEvent() {

		const {
			props: {
				hideEventName,
			},
			state: {
				popupPresent,
				hideBtn,
			},
		} = this;

		$(document).bind(`touchstart.${hideEventName} click.${hideEventName}`, (e) => {
			let target = $(e.target);
			if (!this.getState('flag')) {
				this.setState('flag', true);
				setTimeout(() => {
					this.setState('flag', false);
				}, 200);
				console.log(this.excludeHideEvents(target));
				if (this.excludeHideEvents(target) && target.closest(popupPresent).length === 0) {
					this.hide();
				}
			}
		});

		$(document).bind(`keyup.${hideEventName}`, (e) => {
			if (e.keyCode === 27) {
				e.preventDefault();
				this.hide();
			}
		});

		if (hideBtn !== null) {
			$(hideBtn).on('touchstart click', () => {
				this.hide();
				return false;
			});
		}
	}


	hide() {
		const {
			props: {
				popupVisuallyHiddenClassName,
				popupShowClassName,
				popupPresentShowClassName,
				hideEventName,
				onCloseCallback,
			},
			state: {
				popupRoot,
				popupPresent,
				hideBtn,
			},
		} = this;
		this.setState('isPopupShow', false);
		popupRoot.classList.remove(popupShowClassName);
		popupPresent.classList.remove(popupPresentShowClassName);
		setTimeout(() => {
			popupPresent.classList.add(popupVisuallyHiddenClassName);
		}, 300);
		$(document).unbind(`.${hideEventName}`);
		if (hideBtn !== null) {
			$(hideBtn).unbind('touchstart click');
		}
		this.unlockScroll();
		onCloseCallback(popupPresent, this.getState('currentTarget'));
	}

	show() {

		const {
			props: {
				popupVisuallyHiddenClassName,
				popupShowClassName,
				popupPresentShowClassName,
				onOpenCallback,
			},
			state: {
				popupRoot,
				popupPresent,
			},
		} = this;

		popupRoot.classList.add(popupShowClassName);
		popupPresent.classList.add(popupPresentShowClassName);
		popupPresent.classList.remove(popupVisuallyHiddenClassName);
		this.setState('isPopupShow', true);

		this.lockScroll();
		this.initHideEvent();

		onOpenCallback(popupPresent, this.getState('currentTarget'));
	}

	initShowEvents() {
		const {
			props: {
				showBtnClassName,
				btnParentClassName
			},
		} = this;
		$(btnParentClassName ? `.${btnParentClassName}` : 'body').on('click', `.${showBtnClassName}`, (e) => {
			e.stopPropagation();
			e.preventDefault();
			this.setState('currentTarget', e.currentTarget);
			if (!this.getState('flag')) {
				this.setState('flag', true);
				setTimeout(() => {
					this.setState('flag', false);
				}, 200);
				if (!this.state.isPopupShow) {
					this.show(e.currentTarget);
				} else {
					this.hide();
				}
			}
		});
	}

	init() {
		const {
			props: {
				popupVisuallyHiddenClassName,
				popupRootClassName,
				popupPresentClassName,
				hideBtnClassName,
				showBtnClassName,
				onInitCallback,
				excludeHideSelectorsArr
			},
		} = this;

		if (!popupPresentClassName && !showBtnClassName) {
			console.error('popupPresentClassName & showBtnClassName - required field');
			return false;
		}

		this.setState('excludeHideSelectorsArr', this.getState('excludeHideSelectorsArr').concat(excludeHideSelectorsArr));
		this.setState('showBtns', $(`.${showBtnClassName}`));
		this.setState('popupRoot', document.querySelectorAll(`.${popupRootClassName}`)[0]);
		this.setState('popupPresent', this.getState('popupRoot').querySelectorAll(`.${popupPresentClassName}`)[0]);

		this.getState('popupPresent').classList.add(popupVisuallyHiddenClassName);
		this.getState('popupPresent').style.display = '';

		if (hideBtnClassName) {
			this.setState('hideBtn', this.getState('popupPresent').querySelectorAll(`.${hideBtnClassName}`)[0]);
		}

		this.initShowEvents();

		onInitCallback(this.getState('popupPresent'));
	}
}


export class ImagePopup extends Popup {
	constructor(props) {
		super();

		this.props = {
			...this.props,
			templateClassName: 'popup_image',
			templateContentClassName: 'popup_image__content',
			templateHideBtnClassName: 'popup_image__hide',
			templateActionsClassName: 'popup_image__actions',
			hideBtnClassName: 'js_popup_close',
			...props,
		};

		this.state = {
			...this.state,
			src: null,
		};
	}

	template() {
		const {
			templateClassName,
			templateContentClassName,
			templateHideBtnClassName,
			templateActionsClassName,
			hideBtnClassName,
		} = this.props;

		const stringTemplate = `<div class="${templateClassName}">
			<div class="${templateActionsClassName}">
				<a href="#" class="${hideBtnClassName} ${templateHideBtnClassName}">
					<svg class="icon-close" width="1.4rem" height="1.4rem">
						<use xlink:href="#icon-close"></use>
					</svg>
				</a>
				<!--a href="#" class="js-rotate ${templateClassName}__rotate">
					<svg class="icon-rotate">
							<use xlink:href="#icon-rotate"></use>
					</svg>
				</a-->
			</div>
			<div class="${templateContentClassName}">
				<div class="${templateContentClassName}__img">
					<img src="${this.state.src}" alt="plan image">
				</div>
			</div>
		</div>`;

		let template = document.createElement('template');
		template.innerHTML = stringTemplate;

		return template.content.firstChild;
	}

	hide() {
		const {
			props: {
				popupShowClassName,
				hideEventName,
				onCloseCallback,
			},
			state: {
				popupRoot,
				popupContent,
				popupPresent,
				hideBtn,
			},
		} = this;
		popupRoot.classList.remove(popupShowClassName);
		setTimeout(() => {
			popupContent.removeChild(popupPresent);
		}, 250);
		$(document).unbind(`.${hideEventName}`);
		if (hideBtn !== null) {
			$(hideBtn).unbind('click');
		}
		this.setState('isPopupShow', false);

		this.unlockScroll();
		onCloseCallback(popupPresent, this.getState('currentTarget'));
	}

	show() {

		const {
			props: {
				popupShowClassName,
				onOpenCallback,
			},
			state: {
				popupRoot,
				popupContent,
				popupPresent,
			},
		} = this;

		popupRoot.classList.add(popupShowClassName);
		popupContent.appendChild(popupPresent);

		this.setState('isPopupShow', true);

		this.lockScroll();
		this.initHideEvent();

		onOpenCallback(popupPresent, this.getState('currentTarget'));
	}

	initShowEvents() {
		const {
			props: {
				hideBtnClassName
			},
			state: {
				showBtns,
			},
		} = this;

		showBtns.forEach((showBtn) => {
			showBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				e.preventDefault();
				this.setState('src', e.currentTarget.getAttribute('href'));
				this.setState('popupPresent', this.template());
				this.setState('hideBtn', this.getState('popupPresent').querySelectorAll(`.${hideBtnClassName}`)[0]);

				this.show();
			}, false);
		});
	}

	init() {
		const {
			props: {
				popupRootClassName,
				popupContentClassName,
				showBtnClassName,
			},
		} = this;

		this.setState('showBtns', document.querySelectorAll(`.${showBtnClassName}`));
		this.setState('popupRoot', document.querySelectorAll(`.${popupRootClassName}`)[0]);
		this.setState('popupContent', this.getState('popupRoot').querySelectorAll(`.${popupContentClassName}`)[0]);

		this.initShowEvents();

	}
}

export class Dropdown extends Popup {


	init() {
		const {
			props: {
				popupVisuallyHiddenClassName,
				popupRootClassName,
				popupPresentClassName,
				hideBtnClassName,
				showBtnClassName,
				onInitCallback,
			},
		} = this;

		if (!popupPresentClassName && !showBtnClassName) {
			console.error('popupPresentClassName & showBtnClassName - required field');
			return false;
		}

		this.setState('showBtns', $(`.${showBtnClassName}`));
		this.setState('popupRoot', $(`.${popupRootClassName}`));
		this.setState('popupPresent', this.getState('popupRoot').find(`.${popupPresentClassName}`));

		this.getState('popupPresent').addClass(popupVisuallyHiddenClassName);
		this.getState('popupPresent').css({'display': ''});

		if (hideBtnClassName) {
			this.setState('hideBtn', this.getState('popupPresent').find(`.${hideBtnClassName}`));
		}

		this.initShowEvents();

		onInitCallback(this.getState('popupPresent'));
	}

	show(target) {

		const {
			props: {
				popupVisuallyHiddenClassName,
				popupShowClassName,
				popupPresentShowClassName,
				onOpenCallback,
			},
			state: {
				popupRoot,
				popupPresent,
			},
		} = this;

		$(target).closest(popupRoot).addClass(popupShowClassName);
		$(target).closest(popupRoot).find(popupPresent).addClass(popupPresentShowClassName).removeClass(popupVisuallyHiddenClassName);
		this.setState('isPopupShow', true);

		this.lockScroll();
		this.initHideEvent();

		onOpenCallback(popupPresent, this.getState('currentTarget'));
	}

	hide() {
		const {
			props: {
				popupVisuallyHiddenClassName,
				popupShowClassName,
				popupPresentShowClassName,
				hideEventName,
				onCloseCallback,
			},
			state: {
				popupRoot,
				popupPresent,
				hideBtn,
			},
		} = this;
		this.setState('isPopupShow', false);
		popupRoot.removeClass(popupShowClassName);
		popupPresent.removeClass(popupPresentShowClassName);
		setTimeout(() => {
			popupPresent.removeClass(popupVisuallyHiddenClassName);
		}, 300);
		$(document).unbind(`.${hideEventName}`);
		if (hideBtn !== null) {
			$(hideBtn).unbind('touchstart click');
		}
		this.unlockScroll();
		onCloseCallback(popupPresent, this.getState('currentTarget'));
	}

	unlockScroll() {
		return void null;
	}

	lockScroll() {
		return void null;
	}
}
