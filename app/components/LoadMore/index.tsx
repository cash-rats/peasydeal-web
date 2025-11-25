import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import type { ReactNode } from 'react';
import type { LinksFunction } from 'react-router';


import styles from './styles/LoadMore.css?url';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
};

/**
 * Determine if the scroll position is at window bottom.
 *
 * @param {Number} [offset]
 */
const isAtWindowBottom = (offset: number = 0): boolean => (window.innerHeight + window.scrollY + offset) >= document.body.scrollHeight

/**
 * If a customed scrollable dom is provided,
 * determines whether the scroll position is at the bottom of that scrollable dom.
 *
 * @param {DOM} <dom>
 * @param {Number} [offset]
 */
const isAtDomBottom = (dom: HTMLElement, offset: number = 0): boolean => (dom.offsetHeight + dom.scrollTop + offset) >= dom.scrollHeight

/**
 * @param {DOM}
 * @returns {boolean}
 */
const hasVerticalScrollbar = (dom: HTMLElement): boolean => dom.scrollHeight > dom.clientHeight;

interface LoadMoreProps {
	/**
	 * The function to callback.
	 * It gets called when window is scrolled down to the bottom and stay for more than
	 * `delay` millseconds.
	 */
	callback: (evt: Event | MouseEvent<HTMLElement>) => void,
	/**
	 * How long (in ms) the callback will be triggered when user staying at bottom.
	 * Default to 1000ms.
	 */
	delay?: number,
	/**
	 * when true, the spinner is displayed. get ignored if `error` is specified.
	 */
	error?: object | null,
	/**
	 * when true, the spinner is displayed. get ignored if `error` is specified.
	 */
	loading?: boolean,
	/**
	 * Offset from the bottom of the page or dom element (in px).
	 * Default to 0.
	 */
	offset: number,
	/**
	 * Pass in custom Dom element to be bound with scroll event.
	 */
	targetDom?: HTMLElement | null,
	/*
	 * Custom loading icon. Display text 'loadng...'  if not provided.
	 */
	spinner?: ReactNode | null,
};

function LoadMore({
	targetDom = null,
	offset = 0,
	loading = false,
	callback = () => { console.log('load more...') },
	delay = 0,
	error = null,
	spinner = null,
}: LoadMoreProps) {
	let timeout: number | undefined | NodeJS.Timeout = undefined;

	const triggerCallback = (evt: Event | MouseEvent<HTMLElement>) => {
		callback(evt);
	}

	const onScroll: EventListener = (evt: Event) => {
		evt.stopPropagation();

		if (!evt.target) return;
		const target = evt.target as HTMLElement
		const isAtBottom = targetDom
			? isAtDomBottom(target, offset)
			: isAtWindowBottom(offset);

		// Clear timeout when the scrollbar move away from bottom
		if (timeout !== undefined) {
			if (!isAtBottom) {
				clearTimeout(timeout);

				timeout = undefined;
			}
		} else if (!loading && isAtBottom) {
			// Setup timeout when we're at window bottom and it's not loading
			// Invoke callback if timeout is not get cleared after 250ms
			// (i.e. user's been staying at bottom > 250ms)
			timeout = setTimeout(() => {
				// Only trigger callback when is not loading  and is not at the DOM bottom
				triggerCallback(evt);

				timeout = undefined;
			}, delay);

		}
	}

	const setupScrollListener = (targetDom: HTMLElement | null) => {
		if (targetDom && hasVerticalScrollbar(targetDom)) {
			targetDom.addEventListener('scroll', onScroll);
			window.removeEventListener('scroll', onScroll);
		} else {
			window.addEventListener('scroll', onScroll);
		}
	};

	const handleOnClick = (evt: MouseEvent<HTMLDivElement>) => {
		triggerCallback(evt);
	}

	useEffect(() => {
		setupScrollListener(targetDom);

		return () => {
			if (targetDom) {
				targetDom.removeEventListener('scroll', onScroll);

				return;
			}

			window.removeEventListener('scroll', onScroll);
		}
	}, [])

	const loadingIndicator = () => {
		return spinner
			? <>{spinner}</>
			: <p> loading </p>
	}

	return (
		<div
			className="loadmore-container"
			onClick={handleOnClick}
		>
			{
				error
					? (
						<div>
							error!
						</div>
					)
					: loading && loadingIndicator()
			}
		</div>
	);
}

export default LoadMore;
