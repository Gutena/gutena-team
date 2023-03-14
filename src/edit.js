/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { 
	store as blockEditorStore,
    InspectorControls,
    PanelColorSettings,
    useInnerBlocksProps,
    ButtonBlockAppender,
    useBlockProps,
    BlockControls,
} from '@wordpress/block-editor'
import { 
    __experimentalBoxControl as BoxControl,
    __experimentalSpacer as Spacer,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    PanelBody,
    BaseControl,
    RangeControl,
    ToggleControl,
    ToolbarGroup, 
} from '@wordpress/components'

/**
 * Slider dependencies
 */
import { CarouselProvider, Slider, ButtonBack, ButtonNext, DotGroup, Dot } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

/**
 * External dependencies
 */
import classNames from 'classnames';
import { isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import EventsControl from './components/EventsControl';
import SelectDeviceDropdown from './components/SelectDeviceDropdown';

/**
 * Style helpers dependencies
 */
import DynamicStyles from './styles'
import './editor.scss'

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const gutenaTeamUniqueIds = [];

const BLOCK_TEMPLATE = [
    [ 'gutena/team-member', { showPopup: true, description: "Meet our talented graphic designer! With a keen eye for design and a passion for creativity, this designer brings a unique perspective to every project. Armed with expert knowledge of typography, color theory, and layout, they are able to craft visually stunning designs.", email: "email@yoursite.com", phone: "020303987" } ],
    [ 'gutena/team-member', { showPopup: true, description: "Meet our talented graphic designer! With a keen eye for design and a passion for creativity, this designer brings a unique perspective to every project. Armed with expert knowledge of typography, color theory, and layout, they are able to craft visually stunning designs.", email: "email@yoursite.com", phone: "020303987" } ],
    [ 'gutena/team-member', { showPopup: true, description: "Meet our talented graphic designer! With a keen eye for design and a passion for creativity, this designer brings a unique perspective to every project. Armed with expert knowledge of typography, color theory, and layout, they are able to craft visually stunning designs.", email: "email@yoursite.com", phone: "020303987" } ],
    [ 'gutena/team-member', { showPopup: true, description: "Meet our talented graphic designer! With a keen eye for design and a passion for creativity, this designer brings a unique perspective to every project. Armed with expert knowledge of typography, color theory, and layout, they are able to craft visually stunning designs.", email: "email@yoursite.com", phone: "020303987" } ],
    [ 'gutena/team-member', { showPopup: true, description: "Meet our talented graphic designer! With a keen eye for design and a passion for creativity, this designer brings a unique perspective to every project. Armed with expert knowledge of typography, color theory, and layout, they are able to craft visually stunning designs.", email: "email@yoursite.com", phone: "020303987" } ],
    [ 'gutena/team-member', { showPopup: true, description: "Meet our talented graphic designer! With a keen eye for design and a passion for creativity, this designer brings a unique perspective to every project. Armed with expert knowledge of typography, color theory, and layout, they are able to craft visually stunning designs.", email: "email@yoursite.com", phone: "020303987" } ],
];

export default function edit( props ) {
    const { clientId, attributes, setAttributes, isSelected, onFocus } = props
    const { 
        uniqueId,
        displayType,
        sliderPadding,
        sliderContainerPadding,
        sliderBoxShadow,
        sliderMinHeight,
        sliderEnable,
        sliderCount, 
        sliderToShow, 
        sliderGutterWidth,
        sliderAutoPlay,
        sliderPlayDirection,
        sliderAutoPlayInterval,
        sliderNavDot,
        sliderNavDotSize,
        sliderNavDotGap,
        sliderNavDotSpace,
        sliderNavDotColors,
        sliderNavArrow,
        sliderNavArrowSize,
        sliderNavArrowSpace,
        sliderNavArrowPosition,
        sliderNavArrowColors,
        sliderHoverColors,
        blockStyles,
        sliderSettings 
    } = attributes

    useEffect( () => {
        setAttributes( { sliderEnable: 'slider' === displayType } )
    }, [ displayType ] )

    const deviceType = useSelect( select => {
        return select( 'core/edit-post' ).__experimentalGetPreviewDeviceType();
    }, [] );

    const { innerBlocksCount } = useSelect(
		( select ) => {
			return {
				innerBlocksCount: select( blockEditorStore ).getBlockCount( clientId ),
			};
		},
		[ clientId ]
	);

    useEffect( () => {
        setAttributes( { sliderCount: innerBlocksCount  } )
    }, [ innerBlocksCount ] )

    const blockProps = useBlockProps( {
        className: classNames( 'gutena-team-block', 'editor', `gutena-team-block-${ uniqueId }`, {
            'can-slide': sliderEnable && sliderCount > 1,
            'has-nav-dot': sliderEnable && sliderNavDot,
            'has-nav-arrow': sliderEnable && sliderNavArrow,
            [ `columns-${ sliderToShow?.[ deviceType.toLowerCase() ] }` ]: ! sliderEnable && sliderToShow?.[ deviceType.toLowerCase() ]
        } ),
    } );

    const innerBlocksProps = useInnerBlocksProps( blockProps, {
        template: BLOCK_TEMPLATE,
        allowedBlocks: [ 'gutena/team-member' ],
		renderAppender: false,
        orientation: "horizontal"
	} );

    useEffect( () => {
        if ( ! uniqueId || gutenaTeamUniqueIds.includes( uniqueId ) ) {
			setAttributes( {
				uniqueId: clientId.substr( 2, 9 ),
			} );
			gutenaTeamUniqueIds.push( clientId.substr( 2, 9 ) );
		} else {
			gutenaTeamUniqueIds.push( uniqueId );
		}
    }, [] )

    const dynamicStyles = DynamicStyles( attributes )
    const renderCSS = (
		<style>
			{`
				.gutena-team-block-${ uniqueId } {
					${ Object.entries( dynamicStyles ).map( ( [ k, v ] ) => `${ k }:${ v }` ).join( ';' ) }
				}
			`}
		</style>
	);

    useEffect( () => {
        if ( ! isEqual( blockStyles, dynamicStyles ) ) {
			setAttributes( {
				blockStyles: dynamicStyles,
			} );
        }
    }, [ dynamicStyles ] )

    // slider settings
    const settings = {
        nav: sliderNavDot,
        controls: sliderNavArrow,
        autoplay: sliderAutoPlay,
        autoplayTimeout: sliderAutoPlayInterval,
        autoplayDirection: sliderPlayDirection,
        responsive: {
            640: {
                items: sliderToShow?.mobile ?? 1,
                gutter: sliderGutterWidth?.mobile ?? 5
            },
            700: {
                items: sliderToShow?.tablet ?? 2,
                gutter: sliderGutterWidth?.tablet ?? 10
            },
            900: {
                items: sliderToShow?.desktop ?? 3,
                gutter: sliderGutterWidth?.desktop ?? 20
            }
        }
    }

    useEffect( () => {
        if ( sliderEnable && ! isEqual( sliderSettings, settings ) ) {
			setAttributes( {
				sliderSettings: settings,
			} );
        }
    }, [ settings ] )

    const renderDots = ( props ) => {
        const {
            currentSlide,
            totalSlides,
            visibleSlides,
            disableActiveDots,
            showAsSelectedForCurrentSlideOnly,
        } = props;
    
        const uids = [];
        const dots = [];
        for ( let i = 0; i < totalSlides; i += 1 ) {
            const multipleSelected = i >= currentSlide && i < ( currentSlide + visibleSlides );
            const singleSelected = i === currentSlide;
            const selected = showAsSelectedForCurrentSlideOnly ? singleSelected : multipleSelected;
            const slide = i >= totalSlides - visibleSlides ? totalSlides - visibleSlides : i;
            if ( ! uids.includes( slide ) ) {
                dots.push(
                    <Dot
                        key={ i }
                        slide={ slide }
                        selected={ selected }
                        disabled={ disableActiveDots ? selected : false }
                    />
                );
                uids.push( slide );
            }
        }
        return dots;
    }

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ButtonBlockAppender
                        rootClientId={ clientId }
                        className="gutena-team-add-slider"
                    />
                </ToolbarGroup>
            </BlockControls>
            <InspectorControls>
            <PanelBody title={ __( 'Styles', 'gutena-team' ) } initialOpen={ true }>
                <ToggleGroupControl label={ __( 'Type', 'gutena-team' ) } value={ displayType } onChange={ ( value ) => setAttributes( { displayType: value } ) } isBlock>
                    <ToggleGroupControlOption value="slider" label={ __( 'Slider', 'gutena-team' ) } />
                    <ToggleGroupControlOption value="grid" label={ __( 'Grid', 'gutena-team' ) } />
                </ToggleGroupControl>
            </PanelBody>
            <PanelBody title={ sliderEnable ? __( 'Slider', 'gutena-team' ) : __( 'Grid', 'gutena-team' ) } initialOpen={ false }>
                    { sliderCount > 1 &&
                        <Spacer marginTop={ 3 } marginBottom={ 2 }>
                            <RangeControl
                                label={ <SelectDeviceDropdown sideLabel={ sliderEnable ? __( 'Item to Show', 'gutena-team' ) : __( 'Columns', 'gutena-team' ) } labelAtLeft={ true } /> }
                                value={ sliderToShow?.[ deviceType.toLowerCase() ] }
                                onChange={ ( value ) => {
                                    setAttributes( { 
                                        sliderToShow: {
                                            ...sliderToShow,
                                            [ deviceType.toLowerCase() ]: value
                                        }
                                    } );
                                } }
                                marks={ true }
                                step={ 1 }
                                min={ 1 }
                                max={ innerBlocksCount > 6 ? 6 : innerBlocksCount }
                            />
                        </Spacer>
                    }
                    { sliderToShow?.[ deviceType.toLowerCase() ] > 1 && 
                        <RangeControl
                            label={ <SelectDeviceDropdown sideLabel={ sliderEnable ? __( 'Gutter Width (px)', 'gutena-team' ) : __( 'Grid Spacing (px)', 'gutena-team' ) } labelAtLeft={ true } /> }
                            value={ sliderGutterWidth?.[ deviceType.toLowerCase() ] }
                            onChange={ ( value ) => {
                                setAttributes( { 
                                    sliderGutterWidth: {
                                        ...sliderGutterWidth,
                                        [ deviceType.toLowerCase() ]: value
                                    }
                                } );
                            } }
                            min={ 0 }
                            max={ 100 }
                        />
                    }
                    { sliderEnable && 
                        <ToggleControl
                            label={ __( 'Autoplay Slider', 'gutena-team' ) }
                            checked={ sliderAutoPlay }
                            onChange={ () => setAttributes( { sliderAutoPlay: ! sliderAutoPlay } ) }
                        />
                    }
                    { sliderEnable && sliderAutoPlay &&
                        <>
                            <ToggleGroupControl label={ __( 'Autoplay Direction', 'gutena-team' ) } value={ sliderPlayDirection } onChange={ ( value ) => setAttributes( { sliderPlayDirection: value } ) } isBlock>
                                <ToggleGroupControlOption value="forward" label={ __( 'Left to Right', 'gutena-team' ) } />
                                <ToggleGroupControlOption value="backward" label={ __( 'Right to Left', 'gutena-team' ) } />
                            </ToggleGroupControl>
                            <RangeControl
                                label={__( 'Autoplay Interval', 'gutena-team' ) }
                                value={ sliderAutoPlayInterval }
                                onChange={ ( value ) => setAttributes( { sliderAutoPlayInterval: value } ) }
                                step={ 50 }
                                min={ 50 }
                                max={ 20000 }
                            />
                        </>
                    }
                </PanelBody>
                <PanelBody title={ __( 'Spacing', 'gutena-team' ) } initialOpen={ false }>
                    <BoxControl
						label={ <SelectDeviceDropdown sideLabel={ __( 'Box Padding', 'gutena-team' ) } labelAtLeft={ true } /> }
						values={ sliderPadding?.[ deviceType.toLowerCase() ] }
						onChange={ ( value ) => {
							setAttributes( { 
								sliderPadding: {
									...sliderPadding,
									[ deviceType.toLowerCase() ]: value
								}
							} )
						} }
					/>
                    <Spacer marginTop={ 3 } marginBottom={ 3 }>
                        <BoxControl
                            label={ __( 'Container Padding', 'gutena-team' ) }
                            values={ sliderContainerPadding }
                            onChange={ ( value ) => setAttributes( { sliderContainerPadding: value } ) }
                        />
                    </Spacer>
                    <RangeControl
                        label={ <SelectDeviceDropdown sideLabel={ __( 'Min Height (px)', 'gutena-team' ) } labelAtLeft={ true } /> }
                        value={ sliderMinHeight?.[ deviceType.toLowerCase() ] }
                        onChange={ ( value ) => {
                            setAttributes( { 
                                sliderMinHeight: {
                                    ...sliderMinHeight,
                                    [ deviceType.toLowerCase() ]: value
                                }
                            } );
                        } }
                        allowReset={ true }
                        min={ 0 }
                        max={ 600 }
                    />
                </PanelBody>
                <EventsControl 
                    componentName='BoxShadowControl'
                    label={ __( 'Card Shadow', 'gutena-tabs' ) }
                    toggleLabel={ __( 'Enable Shadow', 'gutena-tabs' ) }
                    attrValue ={ sliderBoxShadow }
                    onChangeFunc ={ ( value ) => setAttributes( { sliderBoxShadow: value } ) }
                    panelId={ clientId }
                />
                { sliderEnable &&
                    <>
                        <PanelBody title={ __( 'Pagination Dots', 'gutena-team' ) } initialOpen={ false }>
                            <ToggleControl
                                label={ __( 'Show Pagination Dots', 'gutena-team' ) }
                                checked={ sliderNavDot }
                                onChange={ () => setAttributes( { sliderNavDot: ! sliderNavDot } ) }
                            />
                            { sliderNavDot &&
                                <>
                                    <RangeControl
                                        label={ __( 'Dot Size (px)', 'gutena-team' ) }
                                        value={ sliderNavDotSize }
                                        onChange={ ( value ) => setAttributes( { sliderNavDotSize: value } ) }
                                        min={ 5 }
                                        max={ 50 }
                                    />
                                    <RangeControl
                                        label={ __( 'Gap Between Dots (px)', 'gutena-team' ) }
                                        value={ sliderNavDotGap }
                                        onChange={ ( value ) => setAttributes( { sliderNavDotGap: value } ) }
                                        min={ 0 }
                                        max={ 100 }
                                    />
                                    <RangeControl
                                        label={ __( 'Space Before Dots (px)', 'gutena-team' ) }
                                        value={ sliderNavDotSpace }
                                        onChange={ ( value ) => setAttributes( { sliderNavDotSpace: value } ) }
                                        min={ 0 }
                                        max={ 100 }
                                    />
                                    <BaseControl label={ __( 'Dot Color', 'gutena-star-ratings' ) } __nextHasNoMarginBottom={ false }>
                                        <PanelColorSettings
                                            __experimentalHasMultipleOrigins
                                            __experimentalIsRenderedInSidebar
                                            className="gutena-team-inline-color-control"
                                            colorSettings={ [
                                                {
                                                    value: sliderNavDotColors?.normal,
                                                    onChange: ( value ) => setAttributes( { sliderNavDotColors: {
                                                            ...sliderNavDotColors,
                                                            normal: value
                                                        } }
                                                    ),
                                                    label: __( 'Normal Color', 'gutena-team' ),
                                                },
                                                {
                                                    value: sliderNavDotColors?.active,
                                                    onChange: ( value ) => setAttributes( { sliderNavDotColors: {
                                                            ...sliderNavDotColors,
                                                            active: value
                                                        } }
                                                    ),
                                                    label: __( 'Active Color', 'gutena-team' ),
                                                }
                                            ] }
                                        />
                                    </BaseControl>
                                </>
                            }
                        </PanelBody>
                        <PanelBody title={ __( 'Navigation Arrows', 'gutena-team' ) } initialOpen={ false }>
                            <ToggleControl
                                label={ __( 'Show Navigation Arrows', 'gutena-team' ) }
                                checked={ sliderNavArrow }
                                onChange={ () => setAttributes( { sliderNavArrow: ! sliderNavArrow } ) }
                            />
                            { sliderNavArrow &&
                                <>
                                    <RangeControl
                                        label={ __( 'Arrow Size (px)', 'gutena-team' ) }
                                        value={ sliderNavArrowSize }
                                        onChange={ ( value ) => setAttributes( { sliderNavArrowSize: value } ) }
                                        min={ 5 }
                                        max={ 30 }
                                    />
                                    <RangeControl
                                        label={ __( 'Space Before (px)', 'gutena-team' ) }
                                        value={ sliderNavArrowSpace }
                                        onChange={ ( value ) => setAttributes( { sliderNavArrowSpace: value } ) }
                                        min={ 0 }
                                        max={ 100 }
                                    />
                                    { sliderNavDot &&
                                        <RangeControl
                                            label={ __( 'Arrow Position', 'gutena-team' ) }
                                            value={ sliderNavArrowPosition }
                                            onChange={ ( value ) => setAttributes( { sliderNavArrowPosition: value } ) }
                                            min={ 0 }
                                            max={ 50 }
                                        />
                                    }
                                    <BaseControl label={ __( 'Arrow Color', 'gutena-star-ratings' ) } __nextHasNoMarginBottom={ false }>
                                        <PanelColorSettings
                                            __experimentalHasMultipleOrigins
                                            __experimentalIsRenderedInSidebar
                                            className="gutena-team-inline-color-control"
                                            colorSettings={ [
                                                {
                                                    value: sliderNavArrowColors?.normal,
                                                    onChange: ( value ) => setAttributes( { sliderNavArrowColors: {
                                                            ...sliderNavArrowColors,
                                                            normal: value
                                                        } }
                                                    ),
                                                    label: __( 'Normal Color', 'gutena-team' ),
                                                },
                                                {
                                                    value: sliderNavArrowColors?.hover,
                                                    onChange: ( value ) => setAttributes( { sliderNavArrowColors: {
                                                            ...sliderNavArrowColors,
                                                            hover: value
                                                        } }
                                                    ),
                                                    label: __( 'Hover Color', 'gutena-team' ),
                                                }
                                            ] }
                                        />
                                    </BaseControl>
                                </>
                            }
                        </PanelBody>
                    </>
                }
                <PanelBody title={ __( 'Card Hover Colors', 'gutena-team' ) } initialOpen={ false }>
                    <PanelColorSettings
                        __experimentalHasMultipleOrigins
                        __experimentalIsRenderedInSidebar
                        className="gutena-team-inline-color-control"
                        colorSettings={ [
                            {
                                value: sliderHoverColors?.cardBg,
                                onChange: ( value ) => setAttributes( { sliderHoverColors: {
                                        ...sliderHoverColors,
                                        cardBg: value
                                    } }
                                ),
                                label: __( 'Background', 'gutena-team' ),
                            },
                            {
                                value: sliderHoverColors?.name,
                                onChange: ( value ) => setAttributes( { sliderHoverColors: {
                                        ...sliderHoverColors,
                                        name: value
                                    } }
                                ),
                                label: __( 'Author Name', 'gutena-team' ),
                            },
                            {
                                value: sliderHoverColors?.designation,
                                onChange: ( value ) => setAttributes( { sliderHoverColors: {
                                        ...sliderHoverColors,
                                        designation: value
                                    } }
                                ),
                                label: __( 'Designation', 'gutena-team' ),
                            },
                            {
                                value: sliderHoverColors?.border,
                                onChange: ( value ) => setAttributes( { sliderHoverColors: {
                                        ...sliderHoverColors,
                                        border: value
                                    } }
                                ),
                                label: __( 'Border', 'gutena-team' ),
                            }
                        ] }
                    />
                </PanelBody>
            </InspectorControls>

            { renderCSS }
            
            <div { ...innerBlocksProps }>
                { sliderEnable && sliderCount > 1
                ?   <CarouselProvider
                        totalSlides={ sliderCount }
                        visibleSlides={ sliderToShow?.[ deviceType.toLowerCase() ] }
                        isIntrinsicHeight={ true }
                        infinite={ true }
                        isPlaying={ sliderAutoPlay }
                        lockOnWindowScroll={ true }
                        dragEnabled={ false }
                        touchEnabled={ false }
                        interval={ sliderAutoPlayInterval }
                        playDirection={ sliderPlayDirection }
                    >
                        <Slider className="gutena-team-item-container">
                            { innerBlocksProps.children }
                        </Slider>
                        { sliderNavArrow && 
                            <>
                                <ButtonBack className="carousel__button">{ __( 'Back', 'gutena-team' ) }</ButtonBack>
                                <ButtonNext className="carousel__button">{ __( 'Next', 'gutena-team' ) }</ButtonNext>
                            </>
                        }
                        { sliderNavDot && <DotGroup showAsSelectedForCurrentSlideOnly={ true } renderDots={ renderDots } /> }
                    </CarouselProvider>
                :   <div className="gutena-team-item-container" data-slider={ sliderEnable && sliderCount > 1 }>
                        { innerBlocksProps.children }
                    </div>
                }
            </div>
        </>
    )
}
