/**
 * External dependencies
 */
import { includes, merge, pickBy } from 'lodash';
import { boxShadowCss } from './utils/helpers';

export default function DynamicStyles( attributes ) {
	const {
        sliderPadding,
        sliderContainerPadding,
        sliderBoxShadow,
        sliderGutterWidth,
        sliderMinHeight,
        sliderNavDotSize,
        sliderNavDotGap,
        sliderNavDotSpace,
        sliderNavDotColors,
        sliderNavArrowSize,
        sliderNavArrowSpace,
        sliderNavArrowPosition,
        sliderNavArrowColors,
        sliderHoverColors,
    } = attributes

    const transformData = ( data, fallback = {} ) => {
        let output = {}
        merge( output, fallback, data )
        return `${output?.top} ${output?.right} ${output?.bottom} ${output?.left}`
    }
    
    const transformBorder = ( data, type, fallback = {} ) => {
        let output = {}
        merge( output, processBorder( fallback ), processBorder( data ) )

        let newvar = output[ type ]
        return `${newvar?.width} ${newvar?.style} ${newvar?.color}`
    }

    const processBorder = data => {
        if ( typeof data == 'object' && Object.keys( data ).length == 3 ) {
            return {
                top: data,
                right: data,
                bottom: data,
                left: data
            }
        }
        return data
    }

	const styleProps = pickBy( {
        // Container gutter width
        '--gutena--team-item-min-height': sliderMinHeight?.desktop,
        '--gutena--team-item-min-height-tablet': sliderMinHeight?.tablet,
        '--gutena--team-item-min-height-mobile': sliderMinHeight?.mobile,

        // Container gutter width
        '--gutena--team-item-gutter-width': sliderGutterWidth?.desktop,
        '--gutena--team-item-gutter-width-tablet': sliderGutterWidth?.tablet,
        '--gutena--team-item-gutter-width-mobile': sliderGutterWidth?.mobile,

        // Container padding
        '--gutena--team-item-padding': transformData( sliderPadding?.desktop ),
        '--gutena--team-item-padding-tablet': transformData( sliderPadding?.tablet ),
        '--gutena--team-item-padding-mobile': transformData( sliderPadding?.mobile ),

        // Container boxshadow
        '--gutena--team-item-box-shadow': boxShadowCss( sliderBoxShadow?.normal, false ),
        '--gutena--team-item-box-shadow-hover': boxShadowCss( sliderBoxShadow?.hover, false ),

        // Container padding
        '--gutena--team-item-container-padding': transformData( sliderContainerPadding ),

        // nav dot styles
        '--gutena--team-item-nav-dot-size': sliderNavDotSize,
        '--gutena--team-item-nav-dot-gap': sliderNavDotGap,
        '--gutena--team-item-nav-dot-spacing': sliderNavDotSpace,
        '--gutena--team-item-nav-dot-normal-color': sliderNavDotColors?.normal,
        '--gutena--team-item-nav-dot-active-color': sliderNavDotColors?.active,

        // nav arrow styles
        '--gutena--team-item-nav-arrow-size': sliderNavArrowSize,
        '--gutena--team-item-nav-arrow-spacing': sliderNavArrowSpace,
        '--gutena--team-item-nav-arrow-position': sliderNavArrowPosition,
        '--gutena--team-item-nav-arrow-normal-color': sliderNavArrowColors?.normal,
        '--gutena--team-item-nav-arrow-hover-color': sliderNavArrowColors?.hover,

        // hover colors
        '--gutena--team-card-hover-color': sliderHoverColors?.cardBg,
        '--gutena--team-name-hover-color': sliderHoverColors?.name,
        '--gutena--team-designation-hover-color': sliderHoverColors?.designation,
        '--gutena--team-border-hover-color': sliderHoverColors?.border,
        }, value => typeof value !== 'undefined' && '' !== value && 'NaN' !== value && 'none' !== value && ! includes( value, 'undefined' )
    )

	return styleProps
}