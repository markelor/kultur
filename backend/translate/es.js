module.exports = {
    general: {
        generalError: "Algo salió mal. Este error ha sido registrado y será dirigido a nuestro personal. ¡Pedimos disculpas por este inconveniente!",
        permissionError: "Permisos insuficientes.",
        adminOneError: "Permisos insuficientes. No puedes hacer cambios a uno de tu mismo grado o superior.",
        adminTwoError: "Permisos insuficientes. Debes ser administrador para subir a otro a grado de administrador."
    },
    validation: {
        emailLength: "El correo electrónico debe tener al menos 5 caracteres pero no más de 30.",
        emailValid: "Debe ser un correo electrónico válido.",
        nameLength: "El nombre debe tener al menos 5 caracteres pero no más de 35.",
        nameValid: "El nombre no debe tener caracteres especiales.",
        usernameLength: "El nombre de usuario debe tener al menos 3 caracteres pero no más de 15.",
        usernameValid: "El nombre de usuario no debe tener caracteres especiales.",
        passwordLength: "La contraseña debe tener al menos 8 caracteres pero no más de 35.",
        passwordValid: "Debe tener al menos una mayúscula, minúscula, carácter especial y número.",
        aboutYourselfLength: "Acerca de ti no debe tener más de 500 caracteres.",
        titleLength: "El título debe tener al menos 3 caracteres pero no más de 35.",
        titleValid: "El título no debe tener caracteres especiales.",
        locationLength: "La localización no debe tener más de 1000 caracteres.",
        categoryDescriptionLength: "La descripción debe tener al menos 5 caracteres pero no más de 200.",
        eventDescriptionLength: "La descripción debe tener al menos 50 caracteres pero no más de 20000.",
        applicationObservationsDescriptionLength: "La descripción debe tener al menos 5 caracteres pero no más de 300.",
        observationsLength: "Observaciones no debe tener más de 1000 caracteres.",
        discoveryLength: "El descubrimiento no debe tener más de 1000 caracteres.",
        bibliographyLength: "La bibliografía no debe tener más de 1000 caracteres.",
        latitudeValid: "Por favor, inserte la latitud en formato decimal.",
        longitudeValid: "Por favor, inserte la longitud en formato decimal.",
        commentLength: "El comentario no debe tener más de 300 caracteres."
    },
    register: {
        nameProvidedError: "Debe proporcionar un nombre.",
        emailProvidedError: "Debe proporcionar un correo electrónico.",
        usernameProvidedError: "Debe proporcionar un nombre de usuario.",
        passwordProvidedError: "Debe proporcionar una contraseña.",
        duplicateError: "El nombre de usuario o correo electrónico ya existe.",
        saveError: "No se pudo guardar el usuario. Error: ",
        emailSubject: "Tu link de activación",
        emailTextOne: "Hola ",
        emailTextTwo: ", Gracias por registrarse en localhost.com. Haga clic en el siguiente enlace para completar su activación: http://localhost:4200/es/activar/",
        emailHtmlOne: "Hola<strong> ",
        emailHtmlTwo: '</strong>,<br><br>Gracias por registrarse en localhost.com. Haga clic en el siguiente enlace para completar su activación:<br><br><a href="http://localhost:4200/es/activar/',
        emailHtmlThree: '">http://localhost:4200/es/activar/</a>',
        success: "Cuenta registrada! Compruebe su enlace de activación por correo electrónico."
    },
    checkEmail: {
        emailProvidedError: "El correo electrónico no fue proporcionado.",
        emailTakenError: "El correo electronico ya ha sido tomado.",
        success: "El correo electrónico está disponible."
    },
    checkUsername: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
        usernameTakenError: "El nombre de usuario ya ha sido tomado.",
        success: "El nombre de usuario está disponible."
    },
    login: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
        usernameError: "Usuario no encontrado.",
        passwordError: "La contraseña no fue proporcionada.",
        passwordValidError: "No se pudo autentificar la contraseña.",
        activatedError: "La cuenta aún no está activada. Compruebe su enlace de activación por correo electrónico.",
        success: "Usuario autentificado!"
    },
    activate: {
        temporaryTokenProvidedError: "El token temporal no fue proporcionado.",
        expiredError: "El enlace de activación ha caducado.",
        passwordError: "La contraseña no fue proporcionada.",
        passwordValidError: "No se pudo autentificar la contraseña.",
        activatedError: "La cuenta aún no está activada. Compruebe su enlace de activación por correo electrónico.",
        emailSubject: "Cuenta activada",
        emailTextOne: "Hola ",
        emailTextTwo: ", Su cuenta ha sido activada exitosamente!",
        emailHtmlOne: "Hola<strong> ",
        emailHtmlTwo: "</strong>,<br><br>Su cuenta ha sido activada exitosamente!",
        success: "Cuenta activada!"
    },
    resend: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
        passwordProvidedError: "La contraseña no fue proporcionada.",
        userError: "No se pudo autentificar el usuario.",
        validPasswordError: "No se pudo autentificar la contraseña.",
        accountError: "La cuenta ya está activada.",
        emailSubject: "Solicitud de enlace de activación",
        emailTextOne: "Hola ",
        emailTextTwo: ", Recientemente has solicitado un enlace para la nueva cuenta. Haga clic en el siguiente enlace para completar su activación: http://localhost:4200/es/activar/",
        emailHtmlOne: "Hola<strong> ",
        emailHtmlTwo: '</strong>,<br><br>Recientemente has solicitado un enlace para la nueva cuenta. Haga clic en el siguiente enlace para completar su activación:<br><br><a href="http://localhost:4200/es/activar/',
        emailHtmlThree: '">http://localhost:4200/es/activar/</a>',
        success: "El enlace de activación ha sido enviado a "
    },
    resetUsername: {
        emailProvidedError: "El correo electrónico no fue proporcionado.",
        emailError: "El correo electrónico no fue encontrado.",
        emailSubject: "Solicitud de nombre de usuario",
        emailTextOne: "Hola ",
        emailTextTwo: ", Recientemente has solicitado tu nombre de usuario. Guárdelo en sus archivos: ",
        emailHtmlOne: "Hola<strong> ",
        emailHtmlTwo: "</strong>,<br><br>Recientemente has solicitado tu nombre de usuario. Guárdelo en sus archivos: ",
        success: "El nombre de usuario se ha enviado al correo electrónico!"
    },
    resetPassword: {
        tokenProvidedError: "El token no fue proporcionado.",
        usernameError: "No se encontró el nombre de usuario.",
        accountError: "La cuenta aún no se ha activado.",
        emailSubject: "Solicitud para restablecer la contraseña",
        emailTextOne: "Hola ",
        emailTextTwo: ', Recientemente has solicitado un enlace de restablecimiento de contraseña. Haga clic en el enlace de abajo para restablecer su contraseña:<br><br><a href="http://localhost:4200/es/nueva-contraseña/',
        emailHtmlOne: "Hola<strong> ",
        emailHtmlTwo: '</strong>,<br><br>Recientemente has solicitado un enlace de restablecimiento de contraseña. Haga clic en el enlace de abajo para restablecer su contraseña:<br><br><a href="http://localhost:4200/es/nueva-contraseña/',
        emailHtmlThree: '">http://localhost:4200/es/nueva-contraseña/</a>',
        success: "Por favor, compruebe su correo electrónico para el enlace de restablecimiento de contraseña.",
        expiredError: "El enlace de la contraseña ha caducado.",

    },
    savePassword: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
        passwordProvidedError: "La contraseña no fue proporcionada.",
        emailSubject: "Contraseña restablecida recientemente",
        emailTextOne: "Hola ",
        emailTextTwo: ", TEste correo electrónico es para notificarle que su contraseña se ha restablecido recientemente.",
        emailHtmlOne: "Hola<strong> ",
        emailHtmlTwo: "</strong>,<br><br>Este correo electrónico es para notificarle que su contraseña se ha restablecido recientemente.",
        success: "La contraseña se ha restablecido!"
    },
    usersImages: {
        usernamesError: "La lista con nombres de usuario no fue proporcionado."
    },
    headers: {
        tokenError: "No se proporciono ningún token.",
        validError: "Token invalido."
    },
    renewToken: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
        userError: "No se encontró el usuario."
    },
    permission: {
        userError: "No se encontró el usuario."
    },
    management: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
        userError: "No se encontró el usuario.",
        usersError: "Usuarios no encontrados.",
    },
    authentication: {
        userError: "No se encontró el usuario."
    },
    profile: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
    },
    editUser: {
        usernameProvidedError: "El usuario no fue proporcionado.",
        userError: "No se encontró el usuario.",
        nameUpdated: "¡El nombre ha sido actualizado!",
        usernameUpdated: "¡El nombre de usuario ha sido actualizado!",
        emailUpdated: "¡El correo electrónico ha sido actualizado!",
        avatarUpload: "¡El Avatar ha sido subido!",
        aboutYourselfUpdated: "¡Acerca de ti ha sido actualizado!",
        success: "Se han actualizado los permisos.!"
    },
    //File upload
    fileUpload: {
        usernameProvidedError: "El nombre de usuario no fue proporcionado.",
        imageProvidedError: "La imagen no fue proporcionada.",
        bucketProvidedError: "El recipiente no fue proporcionado.",
        nameProvidedError: "El nombre de la imagen no fue proporcionada.",
        uploadError: "¡Se ha producido un error al subir imágenes!",
        uploadSuccess: "Imágenes subidas correctamente.",
        deleteError: "¡Se ha producido un error al eliminar imágenes!",
        deleteSuccess: "Imágenes eliminadas correctamente.",
        keyError: "Debe proporcionar la llave.",
        bucketError: "Debe proporcionar el contenedor de la imagen."
    },
    //newCategory
    newCategory: {
        idProvidedError: 'El ID de la categoría, no fue proporcionado.',
        titleProvidedError: "El título de la categoría es requerida.",
        descriptionProvidedError: "La descripción del la categoría es requerida.",
        categoriesError: "No se encontró la categoría.",
        saveError: "No se pudo guardar la categoría. Error:",
        success: "¡Categoría guardada!"
    },
    //newEvent
    newEvent: {
        createdByProvidedError: "El creador del evento es requerido.",
        categoryIdProvidedError: "El ID de la categoria es requerida.",
        titleProvidedError: "El título del evento es requerido.",
        startProvidedError: "El inicio del evento es requerido.",
        endProvidedError: "El final del evento es requerido.",
        descriptionProvidedError: "La descripción del evento es requerido.",
        saveError: "No se pudo guardar el evento. Error:",
        success: "¡Evento guardado!"
    },
    //newApplication
    newApplication: {
        usersProvidedError: "Los usuarios de la aplicación son requeridas.",
        titleProvidedError: "El título de la aplicación es requerida.",
        licenseNameProvidedError: "El nombre de la licencia de la aplicación es requerida.",
        conditionsProvidedError: "Las condiciones de la aplicación son requeridas.",
        priceProvidedError: "El precio de la aplicación es requerida.",
        expiredAtProvidedError: "La fecha de caducidad de la aplicación es requerida.",
        imagesProvidedError: "La imagen de la aplicación es requerida.",
        userError: "No se encontró el usuario.",
        saveError: "No se pudo guardar la aplicación. Error:",
        success: "¡Aplicación guardada!"
    },
    //newService
    newService: {
        createdByProvidedError: "El creador del servicio es requerido.",
        idProvidedError: 'El ID del servicio, no fue proporcionado.',
        serviceTypeIdProvidedError: "El ID del tipo de servicio es requerido.",
        titleProvidedError: "El título del servicio es requerido.",
        descriptionProvidedError: "La descripción del servicio es requerido.",
        latProvidedError: 'La latitud no fue proporcionada.',
        lngProvidedError: 'La longitud no fue proporcionada.',
        servicesError: "No se encontró el servicio.",
        saveError: "No se pudo guardar el servicio. Error:",
        success: "!Servicio guardado!"
    },
    //newServiceType
    newServiceType: {
        idProvidedError: 'El ID del tipo de servicio, no fue proporcionado.',
        titleProvidedError: "El título del tipo de servicio es requerido.",
        serviceTypesError: "No se encontró el tipo de servicio.",
        saveError: "No se pudo guardar el tipo de servicio. Error:",
        success: "!Tipo de Servicio guardado!"
    },
    //newObservation
    newObservation: {
        createdByProvidedError: "El creador de la observación es requerido.",
        idProvidedError: 'El ID de la observación, no fue proporcionado.',
        titleProvidedError: "El título de la observación es requerido.",
        descriptionProvidedError: "La descripción del observación es requerida.",
        observationsError: "No se encontró la observación.",
        saveError: "No se pudo guardar la observación. Error:",
        success: "!Observación guardado!"
    },
    //newComment
    newComment: {
        eventIdProvidedError: "El ID del evento es requerido.",
        createdByProvidedError: "El creador del comentario es requerido.",
        commentProvidedError: "El comentario es requerido.",
        saveError: "No se pudo guardar el comentario. Error:",
        success: "¡Comentario guardado!"
    },
    newEventReaction: {
        idProvidedError: 'El ID del evento, no fue proporcionado.',
        reactionProvidedError: 'La reacción del evento no fue proporcionada.',
        eventError: "No se encontró el evento.",
        userError: "No se encontró el usuario.",
        ownError: "No puedes reaccionar a tu propia publicación.",
        likedBeforeError: "Ya has reaacionado a esta publicación. ",
        saveError: "No se pudo añadir la reacción. Error: ",
        success: "!Reacción añadida!"
    },
    //userEvents
    userEvents: {
        usernameProvidedError: "El usurio de los eventos no fue proporcionado.",
        eventsError: "No se encontraron eventos.",
    },
    //userApplications
    userApplications: {
        usernameProvidedError: "El usurio de las aplicaciones no fue proporcionado.",
        userError: "No se encontró el usuario.",
        applicationsError: "No se encontraron aplicaciones."
    },
    //userServices
    userServices: {
        usernameProvidedError: "El usurio de los servicios no fue proporcionado.",
        eventsError: "No se encontraron servicios.",
    },
    //usersSearch
    usersSearch: {
        searchTermProvidedError: "El término de búsqueda no fue proporcionado.",
        usersError: "Usuarios no encontrados.",
    },
    //eventsSearch
    eventsSearch: {
        searchTermProvidedError: "El término de búsqueda no fue proporcionado.",
        eventsError: "Eventos no encontrados.",
        placesError: "Lugares no encontrados."
    },
    //getEvent
    getEvent: {
        idProvidedError: "El ID del evento no fue proporcionado.",
        eventError: "No se encontro el evento.",
        placeError: "No se encontro el lugar.",
        categoryError: "No se encontró la categoría."
    },
    //getApplication
    getApplication: {
        idProvidedError: "El ID de la aplicación no fue proporcionado.",
        applicationError: "No se encontró la aplicación."
    },
    //getService
    getService: {
        idProvidedError: "El ID del servicio no fue proporcionado.",
        usernameProvidedError: "El usurio de los servicios no fue proporcionado.",
        userError: "No se encontró el usuario.",
        serviceError: "No se encontro el servicio.",
        placeError: "No se encontro el lugar."
    },
    //getObservation
    getObservation: {
        idProvidedError: "El ID de la observación no fue proporcionado.",
        usernameProvidedError: "El usurio de las observaciones no fue proporcionado.",
        userError: "No se encontró el usuario.",
        observationError: "No se encontro la observación."
    },
    //getComment
    getComment: {
        idProvidedError: "El ID del comentario no fue proporcionado.",
        usernameProvidedError: "El usurio del comentario no fue proporcionado.",
        commentError: "No se encontro el comentario."
    },
    //getPlacesCoordinates
    getPlacesCoordinates: {
        provinceProvidedError: 'La provincia no fue proporcionada.',
        municipalityProvidedError: 'El municipio no fue proporcionado.',
        placesError: "No se encontraron lugares."
    },
    //newPlace
    newPlace: {
        eventIdProvidedError: 'El ID del evento es requerido.',
        provinceProvidedError: "La provincia es requerida.",
        geonameIdProvinceProvidedError: "Geoname ID de la provincia es requerida.",
        municipalityProvidedError: "El municipio es requerido.",
        geonameIdMunicipalityProvidedError: "Geoname ID del municipio es requerido.",
        latProvidedError: "La latitud es requerida.",
        lngProvidedError: "La longitud es requerida.",
        locationProvidedError: "La localización es requerida.",
        saveError: "No se pudo guardar el lugar. Error:",
        success: "¡Lugar guardado!"
    },
    singleTheme: {
        paramProvidedError: "El ID del tema, no fue proporcionado.",
        themeError: "No se encontró ningun tema."
    },
    editCategory: {
        idProvidedError: 'El ID de la categoría, no fue proporcionada.',
        categoryError: "No se encontró la categoría.",
        userError: "No se encontró el usuario.",
        permissionError: "No estás autorizado para editar esta categoría.",
        saveError: "No se pudo editar la categoría. Error: ",
        success: "¡Categoría actualizada!"
    },
    editEvent: {
        idProvidedError: 'El ID del evento, no fue proporcionado.',
        createdByProvidedError: 'El nombre de usuario no fue proporcionado.',
        saveError: "No se pudo editar el evento. Error: ",
        success: "¡Evento editado!"
    },
    editApplication: {
        idProvidedError: 'El ID de la aplicación, no fue proporcionado.',
        usersProvidedError: "Los usuarios de la aplicación no fueron proporcionados.",
        saveError: "No se pudo editar la aplicación. Error: ",
        success: "¡Aplicación editada!"
    },
    editService: {
        idProvidedError: 'El ID del servicio, no fue proporcionado.',
        createdByProvidedError: 'El nombre de usuario no fue proporcionado.',
        saveError: "No se pudo editar el servicio. Error: ",
        success: "¡Servicio editado!"
    },
    editServiceType: {
        idProvidedError: 'El ID del tipo de servicio, no fue proporcionado.',
        serviceTypeError: "No se encontró el tipo de servicio.",
        userError: "No se encontró el usuario.",
        permissionError: "No estás autorizado para editar el tipo de servicio.",
        saveError: "No se pudo editar el tipo de servicio. Error: ",
        success: "¡Tipo de servicio actualizado!"
    },
    editObservation: {
        idProvidedError: 'El ID de la observación, no fue proporcionado.',
        createdByProvidedError: 'El nombre de usuario no fue proporcionado.',
        saveError: "No se pudo editar la observación. Error: ",
        success: "¡Observación editada!"
    },
    editComment: {
        idProvidedError: 'El ID del comentario, no fue proporcionado.',
        usernameProvidedError: 'El nombre de usuario no fue proporcionado.',
        createdByProvidedError: 'El nombre de usuario no fue proporcionado.',
        commentProvidedError: 'El comentario no fue proporcionado.',
        saveError: "No se pudo editar el comentario. Error: ",
        success: "¡Comentario editado!"
    },
    deleteCategory: {
        idProvidedError: 'El ID de la categoría, no fue proporcionado.',
        deleteError: "No se pudo eliminar la categoría, está siendo utilizado por eventos.",
        saveError: "No se pudo eliminar la categoría. Error: ",
        success: "¡Categoría eliminada!"
    },
    deleteEvent: {
        usernameProvidedError: 'El nombre de usuario no fue proporcionado.',
        idProvidedError: 'El ID del evento, no fue proporcionado.',
        saveError: "No se pudo eliminar el evento. Error: ",
        success: "¡Evento eliminado!"
    },
    deleteApplication: {
        usernameProvidedError: 'El nombre de usuario no fue proporcionado.',
        idProvidedError: 'El ID del evento, no fue proporcionado.',
        saveError: "No se pudo eliminar la aplicación. Error: ",
        success: "¡Aplikación eliminada!"
    },
    deleteService: {
        usernameProvidedError: 'El nombre de usuario no fue proporcionado.',
        idProvidedError: 'El ID del servicio, no fue proporcionado.',
        deleteError: "No se pudo eliminar el servicio, está siendo utilizado por otra aplicación.",
        saveError: "No se pudo eliminar el servicio. Error: ",
        success: "¡Servicio eliminado!"
    },
    deleteServiceType: {
        idProvidedError: 'El ID del tipo de servicio, no fue proporcionado.',
        saveError: "No se pudo eliminar el tipo de servicio. Error: ",
        success: "¡Tipo de servicio eliminado!"
    },
    deleteObservation: {
        usernameProvidedError: 'El nombre de usuario no fue proporcionado.',
        idProvidedError: 'El ID de la observación, no fue proporcionado.',
        deleteError: "No se pudo eliminar la observación, está siendo utilizado por otra aplicación.",
        saveError: "No se pudo eliminar la observación. Error: ",
        success: "¡Observación eliminada!"
    },
    deleteComment: {
        usernameProvidedError: 'El nombre de usuario no fue proporcionado.',
        idProvidedError: 'El ID del comentario, no fue proporcionado.',
        success: "¡Comentario eliminado!"
    },
    deleteEventReaction: {
        idProvidedError: 'El ID del evento, no fue proporcionado.',
        eventError: "No se encontró el evento.",
        userError: "No se encontró el usuario.",
        ownError: "No puedes reaccionar a tu propia publicación.",
        quitBeforeError: "Ya has dejado de reaccionar este evento",
        saveError: "No se pudo eliminar la reacción. Error: ",
        success: "¡Reacción eliminada!"
    },
    comments: {
        commentsError: "No se encontraron comentarios."
    }
};