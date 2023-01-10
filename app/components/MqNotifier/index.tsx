import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface Validator {
	condition: (dom: Window) => boolean;
	callback: (dom: Window) => void;
}

interface MqNotifierProps {
	mqValidators: Validator[];
	children: ReactNode;
	callback?: (dom: Window) => void;
};

function MqNotifier({
	mqValidators = [],
	children,
}: MqNotifierProps) {
	const invokeCallbackWhenConditionsMet = (dom: Window) => {
		for (const validator of mqValidators) {
			if (validator.condition(dom)) {
				validator.callback(dom);
			}
		}
	}

	const mqNotifier = (evt: UIEvent) => {
		const dom = evt.target as Window;
		invokeCallbackWhenConditionsMet(dom);
	}

	useEffect(() => {
		if (window) {
			// Trigger callback when components renders and the conditions are met.
			invokeCallbackWhenConditionsMet(window);
			window.addEventListener('resize', mqNotifier);
		}

		return () => window.removeEventListener('resize', mqNotifier)
	}, [])

	return (
		<>
			{children}
		</>
	);
}

export default MqNotifier;
