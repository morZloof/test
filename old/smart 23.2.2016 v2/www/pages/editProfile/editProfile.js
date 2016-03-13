var editProfile = new editProfileJs()
function editProfileJs() {
    function ctor() {
        // setTimeout(function () {
        //     showPage()
        // }, 1000)

        $(document).keyup(keyUpExit);
        $("#editProfile_exit_button").click(closeEditProfile);
        $(".editProfile_holder_input_button.setNewPassword").click(changePassword);
        $(".editProfile_holder_input_button.setNewEmail").click(changeEmail);
    }

    this.ctor = ctor;

    function showPage(userId) {
        $('.global_page_editProfile').show();
    }

    this.showPage = showPage;

    function keyUpExit(e) {
        if (e.keyCode == 27) {
            closeEditProfile();
        }
    }

    function closeEditProfile() {
        hidePage();
    }

    function hidePage() {
        $('.global_page_editProfile').hide();
    }

    function changePassword() {
        var oldPassword = document.getElementById('old_password').value;
        var newPassword = document.getElementById('new_password').value;
        var verifiedPassword = document.getElementById('verified_password').value;

        if (AllPasswordFieldsAreSet(oldPassword, newPassword, verifiedPassword)) {
            if (verifiedOldPassword(oldPassword)) {
                if (newPasswordVerified(newPassword, verifiedPassword)) {
                    setNewPassword(newPassword);

                } else {
                    $(".editProfile_password_comment").text("הסיסמא לא זהה");
                }
            } else {
                $(".editProfile_password_comment").text("סיסמא ישנה לא נכונה");
            }
        } else {
            $(".editProfile_password_comment").text("נא למלא את כל הפרטים המבוקשים");
        }

        $(".editProfile_password_comment").fadeIn();
    }

    function AllPasswordFieldsAreSet(oldPassword, newPassword, verifiedPassword) {
        if (oldPassword == "" || newPassword == "" || verifiedPassword == "") {
            return false;
        } else {
            return true;
        }
    }

    function verifiedOldPassword(oldPassword) {

        if (oldPassword == oldPassword) { // NEED VERIFIED OLD PASSWORD WITH DATABASE
            return true;
        } else {
            return false;
        }
    }

    function newPasswordVerified(newPassword, verifiedPassword) {

        if (newPassword == verifiedPassword) {
            return true;
        } else {
            return false;
        }
    }

    function setNewPassword(newPassword) {
        //setPassword(newPassword) // SET NEW PASS IN DATABASE
        $(".editProfile_password_comment").text("הסיסמא החדשה עודכנה").css("color", "#1e798e");
    }


    function changeEmail() {
        var password = document.getElementById('password').value;
        var email = document.getElementById('new_email').value;

        if (AllEmailFieldsAreSet(password, email)) {
            if (verifiedOldPassword(password)) {
                if (validateEmail(email)) {
                    setNewEmail(email);
                } else {

                    $(".editProfile_email_comment").text("אימייל לא תקין");
                }
            } else {
                $(".editProfile_email_comment").text("סיסמא לא תקינה");
            }
        } else {
            $(".editProfile_email_comment").text("נא למלא את כל הפרטים המבוקשים");
        }

        $(".editProfile_email_comment").fadeIn();
    }


    function AllEmailFieldsAreSet(password, email) {

        if (password == "" || email == "") {
            return false;
        } else {
            return true;
        }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function setNewEmail(email) {

        $(".editProfile_email_comment").text("אימייל חדש עודכן").css("color", "#1e798e");
        //setEmail(email); //NEED SET NEW EMAIL IN DATABASE
    }
}

