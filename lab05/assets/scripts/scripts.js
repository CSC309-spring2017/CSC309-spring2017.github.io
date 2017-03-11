$( document ).ready(function() {
    
    
    $("input[type='submit']#HTML5Button").click(function(e)
    {
        // Prevents form from submitting right away:
        e.preventDefault(); 
        
        // Allows or keeps halting form submission process; returns true or false.
        return validateClientSide();
    });
    
    
    function validateClientSide()
    {
        var isValid = true;

        // Remove previous error messages, if they exist.
        if ( $('label#birthdayField span.error').length )
            $('label#birthdayField span.error').remove();
        
        
        var dateEntered = $('input#birthday').val();
        if (!moment(dateEntered,'YYYY-MM-DD').isValid()) {
            $('input#birthday').after("<span class='error'>Invalid date.</span>");
            console.log('Invalid Date');
            isValid = false;
        } else {
            console.log('Valid Date');
        }
        
        return isValid;
    }

    
});

/* Show the text box for the other field only when "Other" is selected*/
/* Should this be done is JQuery rather than plain JS? */
function checkvalue(val)
{
    if(val==="other")
       document.getElementById('otherdept').style.display='block';
    else
       document.getElementById('otherdept').style.display='none'; 
}
