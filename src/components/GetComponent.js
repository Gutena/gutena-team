/**
 * Get dynamic component
 */
import BoxShadowControl from  './BoxShadowControl';

const GetComponent = ( props ) => {
    const {
        componentName = '',
    } = props;

    if ( 'BoxShadowControl' === componentName ) {
        return(
            <BoxShadowControl { ...props } />
        );
    }
}

export default GetComponent;