import TiltRibbon from '~/components/Tags/TiltRibbon';
import Scratch from '~/components/Tags/Scratch';
import SunShine from '~/components/Tags/SunShine';
import PennantLeft from '~/components/Tags/Pennant';
import type { RenderableTagMap } from './utils';

interface SaleTagProps {
  shouldRenderTags: RenderableTagMap;
  discount: number;
}

const SaleTag = ({
  shouldRenderTags,
  discount,
}: SaleTagProps) => {
	return (
		<>
			{
				shouldRenderTags['NEW_LEFT'] && (
					<TiltRibbon text='new' direction='left' />
				)
			}

			{
				shouldRenderTags['NEW_RIGHT'] && (
					<TiltRibbon text='new' direction='right' />
				)
			}

			{
				shouldRenderTags['SCRATCH_RIGHT'] && (
					<Scratch text={`${discount}% off`} direction='right' />
				)
			}

			{
				shouldRenderTags['SUN_LEFT'] && (
					<SunShine text={`${discount}% off`} direction='left' />
				)
			}

			{
				shouldRenderTags['SUN_RIGHT'] && (
					<SunShine text={`${discount}% off`} direction='right' />
				)
			}

			{
				shouldRenderTags['PENNANT_LEFT'] && (
					<PennantLeft text1='price off' text2={`${discount}%`} />
				)
			}

			{
				shouldRenderTags['PENNANT_RIGHT'] && (
					<PennantLeft text1='price off' text2={`${discount} %`} direction='right' />
				)
			}
		</>

	)
}

export default SaleTag;