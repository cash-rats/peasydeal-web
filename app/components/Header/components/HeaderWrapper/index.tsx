import type { ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';

interface HeaderProps {
	children: ReactNode;

	categoryBar?: ReactNode;

	style?: CSSProperties | undefined;
};

export default function HeaderWrapper({ children, categoryBar, style }: HeaderProps) {
	// TODO: disable header color toggling.
	// const [enableBgColor, setEnableBgColor] = useState(true);

	// useEffect(() => {
	// 	const handleScroll = (evt: Event) => {
	// 		const windowDOM = window as Window;
	// 		setEnableBgColor(windowDOM.scrollY > 0);
	// 	}

	// 	if (!window) return;
	// 	window.addEventListener('scroll', handleScroll);

	// 	return () => window.removeEventListener('scroll', handleScroll)
	// }, []);

	return (
		<>
			<header style={style} className="flex flex-col border-b border-header-border fixed top-0 w-full z-10 box-border"
			>
				<div className={clsx("w-full h-20 box-border bg-white my-0 mx-auto flex justify-center items-center")}>
					<div className="w-full h-full grid grid-cols-[220px_auto] md:grid-cols-[220px_3fr_1fr]">
						{children}
					</div>
				</div>

				{
					categoryBar && (
						<div className="w-full bg-gallery">
							{categoryBar}
						</div>
					)
				}

			</header>
		</>
	);
}