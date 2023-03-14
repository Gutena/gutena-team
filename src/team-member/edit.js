import { __ } from '@wordpress/i18n'
import { Slide } from 'pure-react-carousel';
import { useSelect } from '@wordpress/data';
import { 
    InspectorControls,
    useBlockProps, 
    useInnerBlocksProps,
    store as blockEditorStore
} from '@wordpress/block-editor';
import { 
    PanelBody,
    TextControl,
    TextareaControl,
    ToggleControl,
} from '@wordpress/components'

/**
 * External dependencies
 */
import classNames from 'classnames';
import placeholderImage from './image.png';

const ALLOWED_BLOCKS = [ 
    'core/image', 
    'core/heading', 
    'core/paragraph', 
    'core/social-links',
    'core/buttons',
]

const BLOCK_TEMPLATE = [
    [ 'core/image', { "className": "gutena-team-member-image", "sizeSlug": "full", "url": placeholderImage, "alt": "Image", "align": "center" } ],
    [ 'core/heading', { "className": "gutena-team-member-name", "textAlign": "center", "level": 6, "content": "John Miller", "align": "center", "style": { "spacing": { "padding": { "top": "0", "right": "0", "bottom": "0", "left": "0" }, "margin": { "top": "20px", "right": "0", "bottom": "0", "left": "0" } }, "typography": { "fontSize": "22px", "fontStyle": "normal", "fontWeight": "500", "textTransform": "none" } } } ],
    [ 'core/paragraph', { "className": "gutena-team-member-designation", "content": "Graphic Designer", "align": "center", "style": { "spacing": { "padding": { "top": "0", "right": "0", "bottom": "0", "left": "0" }, "margin":{ "top": "0", "right": "0", "bottom": "0", "left": "0" } }, "typography": { "fontSize": "16px", "fontStyle": "normal", "fontWeight": "500" } } } ],
    [ 'core/social-links', { "className": "gutena-team-member-social is-style-default", "size": "has-small-icon-size", "style": { "spacing": { "blockGap": { "top": "10px", "left": "10px" }, "padding": { "top": "0", "right": "0", "bottom": "0", "left": "0" }, "margin": { "top": "20px", "right": "0","bottom": "5px", "left": "0" } } }, "layout": { "type": "flex", "justifyContent": "center" } }, [
        [ 'core/social-link', { "url": "#","service": "facebook" } ],
        [ 'core/social-link', { "url": "#","service": "twitter" } ],
        [ 'core/social-link', { "url": "#","service": "instagram" } ],
    ] ]
];

export default function edit( { clientId, context, attributes, setAttributes } ) {
    const { showPopup, description, email, phone } = attributes
    const sliderEnable = context?.gutenaTeamSliderEnabled;
    const sliderCount = context?.gutenaTeamCardCount;

    const { blockIndex } = useSelect(
		( select ) => {
			return {
                blockIndex: select( blockEditorStore ).getBlockIndex( clientId )
			};
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
        className: classNames( 'gutena-team-item-block editor', {
            'popup': showPopup
        } ),
    } );

    const innerBlocksProps = useInnerBlocksProps( blockProps, {
        template: BLOCK_TEMPLATE,
        allowedBlocks: ALLOWED_BLOCKS,
        //templateLock: false,
	} );

    const inspectorControls = (
        <InspectorControls>
            <PanelBody title={ __( 'Popup', 'gutena-team' ) } initialOpen={ false }>
                <ToggleControl
                    label={ __( 'Enable Popup', 'gutena-team' ) }
                    checked={ showPopup }
                    onChange={ () => setAttributes( { showPopup: ! showPopup } ) }
                />
                { showPopup &&
                    <>
                        <TextareaControl
                            label={ __( 'Description', 'gutena-team' ) }
                            value={ description }
                            onChange={ ( value ) => setAttributes( { description: value } ) }
                        />
                        <TextControl
                            label={ __( 'Email Address', 'gutena-team' ) }
                            type="email"
                            value={ email }
                            onChange={ ( value ) => setAttributes( { email: value } ) }
                        />
                        <TextControl
                            label={ __( 'Phone Number', 'gutena-team' ) }
                            value={ phone }
                            onChange={ ( value ) => setAttributes( { phone: value } ) }
                        />
                    </>
                }
            </PanelBody>
        </InspectorControls>
    )

    return (
        <>
            { inspectorControls }
            { sliderEnable && sliderCount > 1
                ? <Slide index={ blockIndex } className="gutena-team-item">
                    <div { ...innerBlocksProps } />
                </Slide>
                : <div className="gutena-team-item">
                    <div { ...innerBlocksProps } />
                </div>
            }
        </>
    );
}
