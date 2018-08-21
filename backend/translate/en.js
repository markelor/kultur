module.exports = {
    general: {
        generalError: "Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!",
        permissionError: "Insufficient permissions.",
        adminOneError: "Insufficient Permissions. You musn't make changes to one of your own degree or higher.",
        adminTwoError: "Insufficient Permissions. You must be an admin to upgrade someone to the admin level."
    },
    validation: {
        emailLength: "E-mail must be at least 5 characters but no more than 30.",
        emailValid: "Must be a valid e-mail.",
        nameLength: "Name must be at least 5 characters but no more than 35.",
        nameValid: "Name must not have any special characters.",
        usernameLength: "Username must be at least 3 characters but no more than 15.",
        usernameValid: "Username must not have any special characters.",
        passwordLength: "Password must be at least 8 characters but no more than 35.",
        passwordValid: "Must have at least one uppercase, lowercase, special character, and number.",
        aboutYourselfLength: "About Yourself must be no longer than 500 characters.",
        titleLength: "Title must be more than 3 characters but no more than 35.",
        titleValid: "Title must not have any special characters.",
        locationLength: "Location must be no longer than 1000 characters.",
        categoryDescriptionLength: "Description must be more than 5 characters but no more than 200.",
        eventDescriptionLength: "Description must be more than 50 characters but no more than 20000.",
        applicationObservationsDescriptionLength: "Application must be more than 5 characters but no more than 300.",
        observationsLength: "Observations must be no longer than 1000 characters.",
        discoveryLength: "Discovery must be no longer than 1000 characters.",
        bibliographyLength: "Bibliography must be no longer than 1000 characters.",
        latitudeValid: "Please, insert latitude in decimal format.",
        longitudeValid: "Please, insert longitude in decimal format.",
        commentLength: "Comment must be no longer than 300 characters."
    },
    register: {
        nameProvidedError: "You must provide a name.",
        emailProvidedError: "You must provide an e-mail.",
        usernameProvidedError: "You must provide a username.",
        passwordProvidedError: "You must provide a password.",
        duplicateError: "Username or e-mail already exists.",
        saveError: "Could not save user. Error: ",
        emailSubject: "Your activation link",
        emailTextOne: "Hello ",
        emailTextTwo: ", thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:4200/en/activate/",
        emailHtmlOne: "Hello<strong> ",
        emailHtmlTwo: '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:4200/en/activate/',
        emailHtmlThree: '">http://localhost:4200/en/activate/</a>',
        success: "Account registered! Please check your e-mail for activation link."
    },
    checkEmail: {
        emailProvidedError: "E-mail was not provided.",
        emailTakenError: "E-mail is already taken.",
        success: "E-mail is available."
    },
    checkUsername: {
        usernameProvidedError: "Username was not provided.",
        usernameTakenError: "Username is already taken.",
        success: "Username is available."
    },
    login: {
        usernameProvidedError: "Username was not provided.",
        usernameError: "Username not found.",
        passwordError: "Password was not provided.",
        passwordValidError: "Could not authenticate password.",
        activatedError: "Account is not yet activated. Please check your e-mail for activation link.",
        success: "User authenticated!"
    },
    activate: {
        temporaryTokenProvidedError: "Temporary token was not provided.",
        expiredError: "Activation link has expired.",
        passwordError: "No password provided.",
        passwordValidError: "Could not authenticate password.",
        activatedError: "Account is not yet activated. Please check your e-mail for activation link.",
        emailSubject: "Account activated",
        emailTextOne: "Hello ",
        emailTextTwo: ", Your account has been successfully activated!",
        emailHtmlOne: "Hello<strong> ",
        emailHtmlTwo: "</strong>,<br><br>Your account has been successfully activated!",
        success: "Account activated!"
    },
    resend: {
        usernameProvidedError: "Username was not provided.",
        passwordProvidedError: "Password was not provided.",
        userError: "Could not authenticate user.",
        validPasswordError: "Could not authenticate password.",
        accountError: "Account is already activated.",
        emailSubject: "Activation link request",
        emailTextOne: "Hello ",
        emailTextTwo: ", You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:4200/en/activate/",
        emailHtmlOne: "Hello<strong> ",
        emailHtmlTwo: '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:4200/en/activate/',
        emailHtmlThree: '">http://localhost:4200/en/activate/</a>',
        success: "Activation link has been sent to "
    },
    resetUsername: {
        emailProvidedError: "E-mail was not provided.",
        emailError: "E-mail was not found.",
        emailSubject: "Username request",
        emailTextOne: "Hello ",
        emailTextTwo: ", You recently requested your username. Please save it in your files: ",
        emailHtmlOne: "Hello<strong> ",
        emailHtmlTwo: "</strong>,<br><br>You recently requested your username. Please save it in your files: ",
        success: "Username has been sent to e-mail!"
    },
    resetPassword: {
        tokenProvidedError: "Token was not provided.",
        usernameError: "Username was not found.",
        accountError: "Account has not yet been activated.",
        emailSubject: "Reset password request",
        emailTextOne: "Hello ",
        emailTextTwo: ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:4200/en/new-password/',
        emailHtmlOne: "Hello<strong> ",
        emailHtmlTwo: '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:4200/en/new-password/',
        emailHtmlThree: '">http://localhost:4200/en/new-password/</a>',
        success: "Please, check your e-mail for password reset link.",
        expiredError: "Password link has expired.",

    },
    savePassword: {
        usernameProvidedError: "Username was not provided.",
        passwordProvidedError: "Password was not provided.",
        emailSubject: "Password recently reset",
        emailTextOne: "Hello ",
        emailTextTwo: ", This e-mail is to notify you that your password was recently reset.",
        emailHtmlOne: "Hello<strong> ",
        emailHtmlTwo: "</strong>,<br><br>This e-mail is to notify you that your password was recently reset.",
        success: "Password has been reset!"
    },
    usersImages: {
        usernamesError: "The list with user names was not provided."
    },
    headers: {
        tokenError: "No token provided.",
        validError: "Token invalid."
    },
    renewToken: {
        usernameProvidedError: "Username was not provided.",
        userError: "No user was found."
    },
    permission: {
        userError: "No user was found."
    },
    management: {
        usernameProvidedError: "Username was not provided.",
        userError: "No user was found.",
        usersError: "Users not found."
    },
    authentication: {
        userError: "No user was found."
    },
    profile: {
        usernameProvidedError: "Username was not provided.",
    },
    editUser: {
        usernameProvidedError: "Username was not provided.",
        userError: "No user was found.",
        nameUpdated: "Name has been updated!",
        usernameUpdated: "Username has been updated!",
        emailUpdated: "E-mail has been updated!",
        avatarUpload: "Avatar has been upload!",
        aboutYourselfUpdated: "About yourself has been updated!",
        success: "Permissions have been updated!"
    },
    //File upload
    fileUpload: {
        usernameProvidedError: "Username was not provided.",
        imageProvidedError: "Image was not provided.",
        bucketProvidedError: "Bucket was not provided.",
        nameProvidedError: "Image name was not provided.",
        uploadError: "There was an error uploading images!",
        uploadSuccess: "Uploaded images correctly.",
        deleteError: "There was an error deleting images!",
        deleteSuccess: "Deleted images correctly.",
        keyError: "You must provide a key.",
        bucketError: "You must provide a image bucket."

    },
    //newCategory
    newCategory: {
        idProvidedError: 'Category ID was not provided.',
        titleProvidedError: "Category title is required.",
        descriptionProvidedError: "Category description is required.",
        categoriesError: "Categories not found.",
        saveError: "Could not save category. Error:",
        success: "Category saved!"
    },
    //newEvent
    newEvent: {
        createdByProvidedError: "Event creator is required.",
        categoryIdProvidedError: "Category ID is required.",
        titleProvidedError: "Event title is required.",
        startProvidedError: "Event start is required.",
        endProvidedError: "Event end is required.",
        descriptionProvidedError: "Event description is required.",
        saveError: "Could not save event. Error:",
        success: "Event saved!"
    },
    //newApplication
    newApplication: {
        usersProvidedError: "Application users are required.",
        titleProvidedError: "Application title is required.",
        licenseNameProvidedError: "Application license name is required.",
        conditionsProvidedError: "Application conditions are required.",
        priceProvidedError: "Application price is required.",
        expiredAtProvidedError: "Application expired date is required.",
        imagesProvidedError: "Application image is required.",
        userError: "No user found.",
        saveError: "Could not save application. Error:",
        success: "Application saved!"
    },
    //newService
    newService: {
        createdByProvidedError: "Service creator is required.",
        idProvidedError: 'Service ID was not provided.',
        serviceTypeIdProvidedError: "Service type ID is required.",
        titleProvidedError: "Service title is required.",
        descriptionProvidedError: "Service description is required.",
        latProvidedError: 'Latitude was not provided.',
        lngProvidedError: 'Longitude was not provided.',
        servicesError: "Services not found.",
        saveError: "Could not save service. Error:",
        success: "Service saved!"
    },
    //newServiceType
    newServiceType: {
        idProvidedError: 'Service type ID was not provided.',
        titleProvidedError: "Service type title is required.",
        serviceTypesError: "Service types not found.",
        saveError: "Could not save service type. Error:",
        success: "Service type saved!"
    },
    //newObservation
    newObservation: {
        createdByProvidedError: "Observation creator is required.",
        idProvidedError: 'Observation ID was not provided.',
        titleProvidedError: "Observation title is required.",
        descriptionProvidedError: "Observation description is required.",
        observationsError: "Observations not found.",
        saveError: "Could not save observation. Error:",
        success: "Observation saved!"
    },
    //newComment
    newComment: {
        eventIdProvidedError: "Event ID is required.",
        commentProvidedError: "Comment is required.",
        createdByProvidedError: "Comment creator is required.",
        saveError: "Could not save comment. Error:",
        success: "Comment saved!"
    },
    newEventReaction: {
        idProvidedError: 'Event ID was not provided',
        reactionProvidedError: 'Event reaction was not provided',
        eventError: "No event was found.",
        userError: "No user was found.",
        ownError: "You cannot react to your own publication.",
        likedBeforeError: "You already liked this post. ",
        saveError: "Could not save reaction. Error:",
        success: "Reacction added!"
    },
    //userEvents
    userEvents: {
        usernameProvidedError: "Events username is not provided.",
        eventsError: "No events found."
    },
    //userApplications
    userApplications: {
        usernameProvidedError: "Application username is not provided.",
        userError: "No user found.",
        applicationsError: "No applications found."
    },
    //userServices
    userServices: {
        usernameProvidedError: "Services username is not provided.",
        eventsError: "No services found."
    },
    //usersSearch
    usersSearch: {
        searchTermProvidedError: "Search term is not provided.",
        usersError: "Users not found.",
    },
    //eventsSearch
    eventsSearch: {
        searchTermProvidedError: "Search term is not provided.",
        eventsError: "Events not found.",
        placesError: "Places not found."
    },
    //getEvent
    getEvent: {
        idProvidedError: "Event ID is not provided.",
        eventError: "No event found.",
        placeError: "No place found.",
        categoryError: "No category found."
    },
    //getApplication
    getApplication: {
        idProvidedError: 'Application ID was not provided.',
        applicationError: "No application found."
    },
    //getService
    getService: {
        idProvidedError: "Service ID is not provided.",
        usernameProvidedError: "Service username is not provided.",
        userError: "No user found.",
        serviceError: "No service found.",
        placeError: "No place found."
    },
    //getObservation
    getObservation: {
        idProvidedError: "Observation ID is not provided.",
        usernameProvidedError: "Observation username is not provided.",
        userError: "No user found.",
        observationError: "No observation found."
    },
    //getComment
    getComment: {
        idProvidedError: "Comment ID is not provided.",
        usernameProvidedError: "Comment username is not provided.",
        commentError: "No comment found.",
    },
    //getPlacesCoordinates
    getPlacesCoordinates: {
        provinceProvidedError: 'Province was not provided.',
        municipalityProvidedError: 'Municipality was not provided.',
        placesError: "No places found."
    },
    //newPlace
    newPlace: {
        eventIdProvidedError: 'Event ID is required.',
        provinceProvidedError: "Province is required.",
        geonameIdProvinceProvidedError: "Province geoname ID is required.",
        municipalityProvidedError: "Municipality is required.",
        geonameIdMunicipalityProvidedError: "Municipality geoname ID is required.",
        latProvidedError: "Latitude is required.",
        lngProvidedError: "Longitude is required.",
        locationProvidedError: "Location is required.",
        saveError: "Could not save place. Error:",
        success: "Place saved!"
    },
    singleTheme: {
        paramProvidedError: "Theme ID was not provided.",
        themeError: "Theme not found."
    },
    editCategory: {
        idProvidedError: 'Category ID was not provided',
        categoryError: "No category was found.",
        userError: "No user was found.",
        permissionError: "You are not authorized to edit this category.",
        saveError: "Could not edit category. Error: ",
        success: "Category updated!"
    },
    editEvent: {
        idProvidedError: 'Event ID was not provided.',
        createdByProvidedError: 'Username was not provided.',
        saveError: "Could not edit event. Error: ",
        success: "Event edited!"
    },
    editApplication: {
        idProvidedError: 'Application ID was not provided.',
        usersProvidedError: "Application users were not provided.",
        saveError: "Could not edit application. Error: ",
        success: "Application edited!"
    },
    editService: {
        idProvidedError: 'Service ID was not provided.',
        createdByProvidedError: 'Username was not provided.',
        saveError: "Could not edit service. Error: ",
        success: "Service edited!"
    },
    editServiceType: {
        idProvidedError: 'Service type ID was not provided',
        serviceTypeError: "No service type was found.",
        userError: "No user was found.",
        permissionError: "You are not authorized to edit this service type.",
        saveError: "Could not edit service type. Error: ",
        success: "Service type updated!"
    },
    editObservation: {
        idProvidedError: 'Observation ID was not provided.',
        createdByProvidedError: 'Username was not provided.',
        saveError: "Could not edit observation. Error: ",
        success: "Observation edited!"
    },
    editComment: {
        idProvidedError: 'Comment ID was not provided.',
        usernameProvidedError: 'Username was not provided.',
        createdByProvidedError: 'Username was not provided.',
        commentProvidedError: 'Comment was not provided.',
        saveError: "Could not edit comment. Error: ",
        success: "Comment edited!"
    },
    deleteCategory: {
        idProvidedError: 'Category ID was not provided.',
        deleteError: "The category could not be deleted, it is being used by events.",
        saveError: "Could not delete category. Error: ",
        success: "Category deleted!"
    },
    deleteEvent: {
        usernameProvidedError: 'Username was not provided.',
        idProvidedError: 'Event ID was not provided.',
        saveError: "Could not delete event. Error: ",
        success: "Event deleted!"
    },
    deleteApplication: {
        usernameProvidedError: 'Username was not provided.',
        idProvidedError: 'Event ID was not provided.',
        saveError: "Could not delete application. Error: ",
        success: "Application deleted!"
    },
    deleteService: {
        usernameProvidedError: 'Username was not provided.',
        idProvidedError: 'Service ID was not provided.',
        deleteError: "The service could not be deleted, it is being used by another application.",
        saveError: "Could not delete service. Error: ",
        success: "Service deleted!"
    },
    deleteServiceType: {
        idProvidedError: 'Service type ID was not provided.',
        saveError: "Could not delete service type. Error: ",
        success: "Service type deleted!"
    },
    deleteObservation: {
        usernameProvidedError: 'Username was not provided.',
        idProvidedError: 'Observation ID was not provided.',
        deleteError: "The service could not be deleted, it is being used by another application.",
        saveError: "Could not delete observation. Error: ",
        success: "Observation deleted!"
    },
    deleteComment: {
        usernameProvidedError: 'Username was not provided.',
        idProvidedError: 'Comment ID was not provided.',
        success: "Comment deleted!"
    },
    deleteEventReaction: {
        idProvidedError: 'Event ID was not provided',
        eventError: "No event was found.",
        userError: "No user was found.",
        ownError: "You cannot react to your own publication.",
        quitBeforeError: "You already quit the reaction to this event",
        saveError: "Could not delete reaction. Error: ",
        success: "Reaction deleted!"
    },
    comments: {
        commentsError: "Comments not found."
    }
};