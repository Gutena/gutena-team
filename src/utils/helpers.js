//Check if empty
export const gkIsEmpty = data => 'undefined' === typeof data || null === data || '' === data;

//Generate box shadow css
export const boxShadowCss = ( boxShadow, generateCss = true, colorGradientSettings = null ) => {
	let data;
	if (
		gkIsEmpty( boxShadow ) ||
		gkIsEmpty( boxShadow?.onBoxShadow ) ||
		gkIsEmpty( boxShadow?.offsetX ) ||
		gkIsEmpty( boxShadow?.offsetY ) ||
		gkIsEmpty( boxShadow?.color ) ||
		! boxShadow?.onBoxShadow	
	) {
		return '';
	} else {
		data = `${ boxShadow?.offsetX } ${ boxShadow?.offsetY } ${ ! gkIsEmpty( boxShadow?.blurRadius ) ? boxShadow?.blurRadius : `` } ${ ! gkIsEmpty( boxShadow?.spreadRadius ) ? boxShadow?.spreadRadius : `` } ${ gkIsEmpty( boxShadow?.color ) ? ``: getGlobalColorVar( colorGradientSettings, boxShadow?.color ) } ${ ! gkIsEmpty( boxShadow?.inset ) && boxShadow?.inset ? `inset` : `` }`;
	}

	if ( generateCss ) {
		return `box-shadow: ${ data };`;
	}

	return data;
};

/**
 * Get global color as var if use global variable
 */
export const getGlobalColorVar = ( colorGradientSettings, color ) => {
	if ( gkIsEmpty( colorGradientSettings ) || gkIsEmpty( colorGradientSettings?.colors ) || gkIsEmpty( color ) || 15 < color.length ) {
		return color;
	}
	let colorSlug = '';
	colorGradientSettings.colors.forEach( ( colorGroup ) => {
		//break if found colorSlug
		if ( ! gkIsEmpty( colorSlug ) ) {
			return;
		}
		if ( ! gkIsEmpty( colorGroup?.colors ) && ! gkIsEmpty( colorGroup?.name ) ) {
			colorGroup.colors.forEach( ( colorObj ) => { 
				//break if found colorSlug
				if ( ! gkIsEmpty( colorSlug ) ) {
					return;
				}
				if ( ! gkIsEmpty( colorObj?.color ) && ! gkIsEmpty( colorObj?.slug ) && color === colorObj.color ) { 
					colorSlug = ( "custom" === colorGroup.name.toLowerCase() )? 'custom-'+colorObj.slug: colorObj.slug;
				}
			});
		}
   });

   if ( ! gkIsEmpty( colorSlug ) ) {
	return 'var(--wp--preset--color--'+colorSlug+','+color+')';
   } else if ( ! gkIsEmpty( colorGradientSettings?.gradients
	) ) {
		//Match for gradient
		colorGradientSettings.gradients.forEach( ( gradientsGroup ) => {
			//break if found colorSlug
			if ( ! gkIsEmpty( colorSlug ) ) {
				return;
			}
			if ( ! gkIsEmpty( gradientsGroup?.gradients ) && ! gkIsEmpty( gradientsGroup?.name ) ) {
				gradientsGroup.gradients.forEach( ( gradientsObj ) => { 
					//break if found colorSlug
					if ( ! gkIsEmpty( colorSlug ) ) {
						return;
					}

					if ( ! gkIsEmpty( gradientsObj?.gradient ) && ! gkIsEmpty( gradientsObj?.slug ) && color === gradientsObj.gradient ) { 
						colorSlug = ( "custom" === gradientsGroup.name.toLowerCase() ) ? 'custom-'+gradientsObj.slug: gradientsObj.slug;
					}

				});
			}
	   });
   }
   return gkIsEmpty( colorSlug ) ? color : 'var(--wp--preset--gradient--'+colorSlug+','+color+')';
}