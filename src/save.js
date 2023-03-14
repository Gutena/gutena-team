import { __ } from '@wordpress/i18n'
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor'

import classNames from 'classnames';

export default function save( { attributes } ) {
    const { uniqueId, sliderEnable, sliderToShow, sliderCount, sliderNavDot, sliderNavArrow } = attributes;
    const blockProps = useBlockProps.save( {
        className: classNames( 'gutena-team-block', `gutena-team-block-${ uniqueId }`, {
            'can-slide': sliderEnable && sliderCount > 1,
            'has-nav-dot': sliderEnable && sliderNavDot,
            'has-nav-arrow': sliderEnable && sliderNavArrow,
            [ `columns-${ sliderToShow?.desktop }` ]: ! sliderEnable && sliderToShow?.desktop,
            [ `columns-md-${ sliderToShow?.tablet } }` ]: ! sliderEnable && sliderToShow?.tablet,
            [ `columns-sm-${ sliderToShow?.mobile }` ]: ! sliderEnable && sliderToShow?.mobile,
        } ),
    } )
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return (
        <div { ...innerBlocksProps }>
            <div className="gutena-team-item-container" data-slider={ sliderEnable && sliderCount > 1 }>
                { innerBlocksProps.children }
            </div>
        </div>
    );
}
