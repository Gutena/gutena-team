import { merge } from 'lodash';
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { tns } from 'tiny-slider/src/tiny-slider';
import tingle from 'tingle.js';

// expose slider object to window.
var gutenaTeamSliders = [];

document.addEventListener( 'DOMContentLoaded', () => {
    let i = 0;
    const teamNodeList = document.querySelectorAll( '.gutena-team-block > .gutena-team-item-container' );
    teamNodeList?.forEach( ( el, index ) => {
        let canSlider = el?.getAttribute( 'data-slider' );
        let settingsData = el?.getAttribute( 'data-slider-settings' );
        el?.removeAttribute( 'data-slider-settings' );

        if ( canSlider === 'true' ) {
            el?.setAttribute( 'data-slider-index', i );
            i++;

            let sliderData = {
                container: el,
                items: 1,
                gutter: 10,
                autoplay: true,
                navAsThumbnails: true,
                mouseDrag: true,
                navPosition: "bottom",
                autoplayButtonOutput: false,
                speed: 500
            }; 

            if ( settingsData ) {
                settingsData = JSON.parse( settingsData )
                sliderData = merge( sliderData, settingsData )
            }

            const slider = tns( applyFilters( 'gutenaTeam.settingsData', sliderData, index ) );
            gutenaTeamSliders.push( slider )
        }

        const items = el.querySelectorAll( '.gutena-team-item-block' );
        items?.forEach( ( el, index ) => {
            if ( el.classList.contains( 'popup' ) ) {
                let popupContent = '';

                // image
                const image = el?.querySelector( '.gutena-team-member-image > img' );
                if ( image ) {
                    popupContent += '<div class="gutena-team-popup-image"><img src="' + image?.src + '" alt="" class="gutena-testimonial-image"></div>'
                }

                let popupInnerContent = ''
                const authorName = el?.querySelector( '.gutena-team-member-name' );
                if ( authorName ) {
                    popupInnerContent += '<div class="gutena-team-member-name">' + authorName?.innerHTML + '</div>'
                }

                const authorPosition = el?.querySelector( '.gutena-team-member-designation' );
                if ( authorPosition ) {
                    popupInnerContent += '<div class="gutena-team-member-position">' + authorPosition?.innerHTML + '</div>'
                }

                // Details
                const parentContent = el?.nextElementSibling;
                if ( parentContent && parentContent !== 'undefined' && parentContent?.classList.contains( 'gutena-team-item-popup' ) ) {
                    const authorInfo = parentContent?.querySelector( '.gutena-team-description' );
                    if ( authorInfo ) {
                        popupInnerContent += authorInfo?.outerHTML
                    }   
                    
                    let popupInnerContentContact = ''
                    const authorPhone = parentContent?.querySelector( '.gutena-team-phone' );
                    if ( authorPhone ) {
                        popupInnerContentContact += authorPhone?.outerHTML
                    } 

                    const authorEmail = parentContent?.querySelector( '.gutena-team-email' );
                    if ( authorEmail ) {
                        popupInnerContentContact += authorEmail?.outerHTML
                    }

                    if ( popupInnerContentContact ) {
                        popupInnerContent += '<div class="gutena-team-contact">' + popupInnerContentContact + '</div>'
                    }
                    //popupInnerContent += parentContent.innerHTML;
                }

                const authorSocial = el?.querySelector( '.gutena-team-member-social' );
                if ( authorSocial ) {
                    popupInnerContent += '<div class="gutena-team-member-socials">' + authorSocial?.outerHTML + '</div>'
                }

                if ( popupInnerContent ) {
                    popupContent += '<div class="gutena-team-popup-content">' + popupInnerContent +'</div>';
                }
                
                if ( popupContent ) {
                    popupContent = '<div class="gutena-team-modal-popup-content">' + popupContent + '</div>';
                    popupContent = '<span class="gutena-lightbox-close"><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.3 9.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3L5 6.4l3.3 3.3c.2.2.5.3.7.3.2 0 .5-.1.7-.3.4-.4.4-1 0-1.4L6.4 5l3.3-3.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L5 3.6 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4L3.6 5 .3 8.3c-.4.4-.4 1 0 1.4z" fill="#000" fill-rule="nonzero"></path></svg></span>' + popupContent;
                }

                el.style.cursor = 'pointer';

                // on click open popup
                el.addEventListener( 'click', e => {
                    e.preventDefault();
                    
                    let videoModal = new tingle.modal( {
                        closeMethods: [ 'button', 'escape' ],
                        cssClass: [ 'gutena-lightbox-modal' ],
                        closeLabel: __( "Close", "gutena-lightbox" ),
                        onOpen: function() {
                            const lightboxCloseNodeList = document.querySelectorAll( '.gutena-lightbox-close' );
                            lightboxCloseNodeList?.forEach( ( el, index ) => {
                                el.addEventListener( 'click', event => {
                                    event.preventDefault()
                                    let modal = el.closest( '.tingle-modal' )
                                    modal.querySelector( '.tingle-modal__close' ).click()
                                } );
                            } );
                        },
                        onClose: function () {
                            videoModal.destroy();
                        }
                    } );
    
                    videoModal.setContent( popupContent );
                    videoModal.open();
                } );

                el?.querySelectorAll( 'a' )?.forEach( ( el, index ) => {
                    el.addEventListener( 'click', e => {
                        e.stopPropagation(); 
                    } );
                } );
            }
        } );
    } );
} );