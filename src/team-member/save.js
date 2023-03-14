/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n'
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor'

export default function save( { attributes } ) {
    const { showPopup, description, email, phone } = attributes
	const blockProps = useBlockProps.save( {
        className: classNames( 'gutena-team-item-block', {
            'popup': showPopup
        } ),
    } )
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return (
        <div className="gutena-team-item">
            <div { ...innerBlocksProps } />
            { showPopup && 
                <div class="gutena-team-item-popup">
                    { description && <div class="gutena-team-description">{ description } </div> }
                    { phone && <div class="gutena-team-phone">{ __( 'Phone:', 'gutena-team' ) } { phone } </div> }
                    { email && <div class="gutena-team-email">{ __( 'Email:', 'gutena-team' ) } { email } </div> }
                </div>
            }
        </div>
    );
}
