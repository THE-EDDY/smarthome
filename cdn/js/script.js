var host = window.location.hostname;

if(host === 'localhost') {
    var base_url = 'http://localhost/smarthome';
}else{
    var base_url = '';
}


function bg_function(obj, ddata = null, method = 'GET', link = null) {
    event.preventDefault();
    //ealert.fire('info', 'Processing your request. Please wait.');

    let old_text = obj.innerHTML;
    obj.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i>";

    if(link === null) {
        var href = obj.getAttribute('href');
    }else{
        var href = link;
    }


    $.ajax({
        type: method,
        url: href,
        data: ddata,
        cache: false,             // To unable request pages to be cached
        processData: false,        // To send DOMDocument or non processed data file it is set to false
        success: function (data) {

            if (data.status === 'success') {

                obj.innerHTML = "<i class='fas fa-check'></i>";
                setTimeout(function () {
                    obj.innerHTML = old_text;
                }, 1000);
                //ealert.fire("success", data.message, "Success");


                if (data.redirect !== undefined) {
                    setTimeout(
                        function () {
                            window.top.location = data.redirect
                        }
                        , 3000);
                }


                if (data.download !== undefined) {
                    window.top.location = data.download
                }

                if (data.refresh === true) {
                    setTimeout(location.reload(), 4000);
                }

            } else if (data.status === 'error') {

                obj.innerHTML = "<i class='fas fa-times'></i>";
                setTimeout(function () {
                    obj.innerHTML = old_text;
                }, 1000);

                swal("Failed", data.message, "error");

            }

        },
        error: function (data) {
            swal("Failed", data, "error");
        }
    });

}


$(document).delegate('form', 'submit', function (event) {


    let form = $(this),
        data = form.serialize(),
        method = form.attr("method"),
        feedback = form.attr("feedback"),
        form_id = form.attr("id"),
        action = form.attr('action'),
        enctype = form.attr('enctype'),
        verify = form.attr('verify'),
        direct = form.attr('direct'),
        form_alert = form.attr('alert'),
        proceed = false;

    if (direct === 'true') {
        return true;

    } else {
        event.preventDefault();

        swal.fire('Processing', 'Please wait', 'info');


    }


    async function ConfirmPassword() {

        if (verify === 'true') {
            const {value: password} = await Swal.fire({
                title: '<h4>Enter your password</h4>',
                input: 'password',
                inputPlaceholder: 'Enter your password',
                inputAttributes: {
                    maxlength: 10,
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                footer: '<span class="font-gray font-xs text-center">We need you to authorize this action by providing your account password.' +
                    'This is a safety measure to protect your account</span>',

            });
            if (password) {
                await $.ajax({
                    type: 'POST',
                    url: base_url + '/user/password_check',
                    data: 'pass=' + password, // serializes the form's elements.
                    cache: false,             // To unable request pages to be cached
                    processData: false,        // To send DOMDocument or non processed data file it is set to false
                    success: function (response) {

                        if (response.status === true) {

                            swal.fire("Processing", "Processing your request. Please wait...", "info");
                            proceed = true;
                            return true;

                        } else if (response.status === false) {
                            swal.fire('Incorrect Password', '', 'error');
                            proceed = false;
                            return false;
                        }
                    },
                    error: function (xhr, tst, err) {
                        alert('XHR ERROR ' + XMLHttpRequest.status);
                    },
                });


            }
        } else {
            proceed = true;
            return true;
        }
    }


    async function ProcessFunction() {
        await ConfirmPassword();

        if (proceed === true) {

            if (action === null) {
                action = window.location.href;
            }

            if (enctype === undefined) {

                $.ajax({
                    type: method,
                    url: action,
                    data: data, // serializes the form's elements.
                    cache: false,             // To unable request pages to be cached
                    processData: false,        // To send DOMDocument or non processed data file it is set to false
                    success: function (data) {

                        if (data.status === 'success') {

                            if(feedback !== 'false') {
                                if (form_alert === undefined) {
                                    swal("Success", data.message, "success");
                                } else if (form_alert === 'ealert') {
                                    ealert.fire('success', data.message);
                                }
                            }

                            if (data.redirect !== undefined) {
                                setTimeout(
                                    function () {
                                        window.top.location = data.redirect
                                    }
                                    , 3000);

                            }

                            if (data.refresh === true) {
                                setTimeout(location.reload(), 4000);
                            }

                            if (data.download !== undefined) {
                                //alert('Downloading file');
                                window.top.location = data.download
                            }


                        } else if (data.status === 'error') {

                            swal("Error", data.message, "error");
                        }


                    },
                    error: function (data) {

                        ealert.fire('error', data);
                    }
                });

                //form.trigger("reset");


            } else {

                var formData = document.getElementById(form_id);

                $.ajax({
                    url: action, // Url to which the request is send
                    type: method,             // Type of request to be send, called as method
                    data: new FormData(formData), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                    enctype: 'multipart/form-data',
                    contentType: false,       // The content type used when sending data to the server.
                    cache: false,             // To unable request pages to be cached
                    processData: false,        // To send DOMDocument or non processed data file it is set to false
                    beforeSend: function () {

                        if (form_alert === undefined) {
                            swal("Success", 'Uploading file', "success");
                        } else if (form_alert === 'ealert') {
                            ealert.fire('success', 'Uploading file');
                        }
                    },
                    success: function (data)   // A function to be called if request succeeds
                    {
                        if (data.status === 'success') {

                            if (form_alert === undefined) {
                                swal("Success", data.message, "success");
                            } else if (form_alert === 'ealert') {
                                ealert.fire('success', data.message);
                            }

                            if (data.redirect !== undefined) {
                                setTimeout(
                                    function () {
                                        window.top.location = data.redirect
                                    }
                                    , 3000);

                            }

                            if (data.refresh === true) {
                                setTimeout(location.reload(), 4000);
                            }


                        } else if (data.status === 'error') {

                            swal("Error", data.message, "error");
                        }


                    },
                    error: function (request, status, error) {

                        ealert.fire('success', request.responseText);
                    }
                });


            }

        }

    }

    ProcessFunction();


});

if($('.datatable').length >= 1)
{
    $(".datatable").DataTable({
        "scrollX": true
    });

}

var idleTime = 0;
$(document).ready(function () {
    // Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
});

function timerIncrement() {
    idleTime++;
    if (idleTime > 19) { // 20 minutes
        window.location.href = '/logout';
    }
}

timerIncrement();

$(document).ready(function(){
    // Add smooth scrolling to all links
    $(".smooth").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: ($(hash).offset().top - 30)
            }, 800, function(){

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

// if ($('section').length >= 1) {
//     $('section').attr('data-aos', 'fade-up');
//
//     AOS.init();
//
// }


function copy(id)
{
    /* Get the text field */
    var copyText = document.getElementById(id);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    toastr.success("Copied the text:" + copyText.value);
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


var specialKeys = new Array();
specialKeys.push(8);  //Backspace
specialKeys.push(46); //Delete
specialKeys.push(37); //Left
specialKeys.push(39); //Right

function IsAlphaNumeric(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));

    return ret;
}


toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

if ($('.dropify').length >= 1) {
    (function ($) {
        "use strict";
        $(function () {
            var drEvent = $('.dropify').dropify();
        });
    })(jQuery);

}

if($('.datepicker').length >= 1)
{
    $(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: +2
    });

}

if ($('select').length >= 1) {

    // if($('select').hasClass("disable_selectize") == false) {
    //     $('select').selectize({
    //         create: false,
    //         sortField: 'text'
    //     });
    // }
}



function printElem(divId) {
    var content = document.getElementById(divId).innerHTML;
    var mywindow = window.open('', 'Print', 'height=600,width=800');

    mywindow.document.write('<html><head><title>Print</title>');
    mywindow.document.write('<link rel="stylesheet" href="' + base_url + 'public/assets2/css/bootstrap.min.css" media="screen, print">');
    mywindow.document.write('<link rel="stylesheet" href="' + base_url + 'public/assets2/look_css/css/look_base_v2.css" type="text/style">');
    mywindow.document.write('<link rel="stylesheet" href="' + base_url + 'assets2/css/style.css" type="text/style">');

    mywindow.document.write(" <style>* {font-family: 'Times New Roman' !important; font-size:20px !Important;} body{font-siz:18px !Important; padding: 30px 80px !Important;color:#000 !Important} body a{color:#000 !Important;} .font-weight-900{font-weight: 900 !Important;} .float-right{float:right !Important} .m-0{ margin:0 !Important } body p font,  p font b, p b u,  p b{font-family: 'Times New Roman' !important;font-size: 18px !Important;}img{font-family: 'Times New Roman' !important;-webkit-print-color-adjust: exact !Important;font-size: 18px !Important;margin-bottom: 20px !Important;}</style>");
    mywindow.document.write('</head><body >');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus()
    mywindow.print();
    //mywindow.close();
    return true;
}


$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    //>=, not <=
    if (scroll >= 30) {
        //clearHeader, not clearheader - caps H
        $("#header").addClass("bg-white border_bottom");
        // $("#black_logo").removeClass("d-none");
        // $("#white_logo").addClass("d-none");
    }else{
        $("#header").removeClass("bg-white border_bottom");
        // $("#white_logo").removeClass("d-none");
        // $("#black_logo").addClass("d-none");
    }


});

// ealert
ealert.position = 'bottom';





function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showPass(id) {
    event.preventDefault();
    var pw_input = $('#'+id);

    if(pw_input.val() === '')
    {

    }else {
        if (pw_input.attr("type") == "password") {
            pw_input.attr("type", "text");
        } else {
            pw_input.attr("type", "password");
        }
    }
};


if($('#pw_button').length >= 1)
{
    $('#pw_button').click(function () {

        var pw_input = $('.show_hide_pw');

        if(pw_input.val() === '')
        {

        }else {
            if (this.text == 'Show') {
                this.text = 'Hide';
            } else {
                this.text = 'Show';
            }
        }

    })

}

if($('#pw_button2').length >= 1)
{
    $('#pw_button2').click(function () {

        if(this.text == 'Show')
        {
            this.text = 'Hide';
        }else{
            this.text = 'Show';
        }

    })

}


var host = window.location.hostname;

if($('#sub_btn').length >= 1) {
    if (host === 'localhost') {

    } else {
        document.getElementById('sub_btn').disabled = true;
        $('#sub_btn').hide();
    }

    function enableBtn() {
        $('#sub_btn').show();
        document.getElementById('sub_btn').disabled = false;
    }
}
