import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ClientOnlyProps {
	children: ReactNode;
}

function ClientOnly({ children, ...delegated }: ClientOnlyProps) {
	const [ hasMounted, setHasMounted ] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) return null;

	return (
		<div {...delegated}>
			{ children }
		</div>
	)
}

export default ClientOnly;
