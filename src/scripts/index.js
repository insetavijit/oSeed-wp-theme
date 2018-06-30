import { MDCRipple } from '@material/ripple';

import { MDCTextField } from '@material/textfield';

// const textField = new MDCTextField(document.querySelectorAll('.mdc-text-field'));

(($)=>{
    
    //register btn ripple effects :
    $('.btns').each((e , el )=>{
        new MDCRipple(el);
    });
    //register the textfields
    $('.ins-field').each((e, el) => {
        new MDCTextField(el);
    });
})(jQuery);