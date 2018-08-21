module.exports = {
    general: {
        generalError: "Zerbait oker joan da. Akatsa, grabatu da eta gure langileei zuzenduko zaie. Barkatu eragozpenak!",
        permissionError: "Ez duzu nahikoa baimen",
        adminOneError: "Ez duzu nahikoa baimen. Ezin diozu zure maila edo handiagoko bati aldaketarik egin.",
        adminTwoError: "Ez duzu nahikoa baimen. Administratzailea izan behar duzu beste bat administratzaile mailara igotzeko."
    },
    validation: {
        emailLength: "Posta elektronikoak gutxienez 5 karaktere izan behar ditu, baina ez 30 baino gehiago.",
        emailValid: "Baliozko posta elektoniko bat izan behar du.",
        nameLength: "Izenak gutxienez 5 karaktere izan behar ditu, baina ez 35 baino gehiago.",
        nameValid: "Izenak ezin du karaktere berezirik izan.",
        usernameLength: "Erabiltzaile izenak gutxienez 3 karaktere izan behar ditu, baina ez 15 baino gehiago.",
        usernameValid: "Erabiltzaile izenak ezin du karaktere berezirik izan.",
        passwordLength: "Pasahitzak gutxienez 8 karaktere izan behar ditu, baina ez 35 baino gehiago.",
        passwordValid: "Gutxienez, maiuskula, minuskula, zenbaki eta karaktere berezi bat izan behar du.",
        aboutYourselfLength: "Zuri buruzek 500 karaktere baino gutxiago izan behar ditu.",
        titleLength: "Tituluak gutxienez 3 karaktere izan behar ditu, baina ez 35 baino gehiago.",
        titleValid: "Tituluak ezin du karaktere berezirik izan.",
        locationLength: "Kokapenak 1000 karaktere baino gutxiago izan behar ditu.",
        categoryDescriptionLength: "Deskribapenak gutxienez 5 karaktere izan behar ditu, baina ez 200 baino gehiago.",
        eventDescriptionLength: "Deskribapenak gutxienez 50 karaktere izan behar ditu, baina ez 20000 baino gehiago.",
        applicationObservationsDescriptionLength: "Deskribapenak gutxienez 5 karaktere izan behar ditu, baina ez 300 baino gehiago.",
        observationLength: "Oharrak 1000 karaktere baino gutxiago izan behar ditu.",
        discoveryLength: "Aurkikuntzak 1000 karaktere baino gutxiago izan behar ditu.",
        bibliographyLength: "Bibliografiak 1000 karaktere baino gutxiago izan behar ditu.",
        latitudeValid: "Mesedez, sar ezazu latitudea hamartar formatuan.",
        longitudeValid: "Mesedez, sar ezazu luzeera hamartar formatuan.",
        commentLength: "Iruzkinak 300 karaktere baino gutxiago izan behar ditu."
    },
    register: {
        nameProvidedError: "Izen bat eman behar duzu.",
        emaiProvidedlError: "Posta elektroniko bat eman behar duzu.",
        usernameProvidedError: "Erabiltzaile izen bat eman behar duzu.",
        passwordProvidedError: "Pasahitz bat eman behar duzu.",
        duplicateError: "Erabiltzaile izena edo posta elektronikoa existitzen da.",
        saveError: "Ezin izan da erabiltzailea gorde. Akatsa: ",
        emailSubject: "Zure aktibazio esteka",
        emailTextOne: "Kaixo ",
        emailTextTwo: ", eskerrik asko localhost.com-en izena emateagatik. Egin klik honako estekan aktibazioa osatzeko: http://localhost:4200/eu/aktibatu/",
        emailHtmlOne: "Kaixo<strong> ",
        emailHtmlTwo: '</strong>,<br><br>Eskerrik asko localhost.com-en izena emateagatik. Egin klik honako estekan aktibazioa osatzeko:<br><br><a href="http://localhost:4200/eu/aktibatu/',
        emailHtmlThree: '">http://localhost:4200/eu/aktibatu/</a>',
        success: "Kontua erregistratuta! Egiaztatu zure posta elektronikoko aktibazio esteka."
    },
    checkEmail: {
        emailProvidedError: "Ez da posta elektronikoa eman.",
        emailTakenError: "Posta elektronikoa hartuta dago.",
        success: "Posta elektronikoa eskuragarri dago."
    },
    checkUsername: {
        usernameProvidedError: "Ez da erabiltzaile izena eman.",
        usernameTakenError: "Erabiltzaile izena hartuta dago.",
        success: "Erabiltzaile izena eskuragarri dago."
    },
    login: {
        usernameProvidedError: "Erabiltzaile izena ez da eman.",
        usernameError: "Erabiltzailea ez da aurkitu.",
        passwordError: "Ez da pasahitzik eman.",
        passwordValidError: "Ezin izan da pasahitza balioztatu.",
        activatedError: "Kontua oraindik ez dago aktibatuta. Egiaztatu zure posta elektronikoko aktibazio esteka.",
        success: "Erabiltzailea balioztatua!"
    },
    activate: {
        temporaryTokenProvidedError: "Behin-behineko tokena ez da eman.",
        expiredError: "Aktibazio esteka iraungi da.",
        passwordError: "Pasahitza ez da eman.",
        passwordValidError: "Ezin izan da pasahitza balioztatu.",
        activatedError: "Kontua oraindik ez dago aktibatuta. Egiaztatu zure posta elektronikoko aktibazio esteka.",
        emailSubject: "kontua aktibatuta",
        emailTextOne: "Kaixo ",
        emailTextTwo: ", Zure kontua ondo aktibatu da!",
        emailHtmlOne: "Kaixo<strong> ",
        emailHtmlTwo: "</strong>,<br><br>Zure kontua ondo aktibatu da!",
        success: "kontua aktibatuta!"
    },
    resend: {
        usernameProvidedError: "Erabiltzaile izena ez da eman.",
        passwordProvidedError: "Pasahitza ez da eman.",
        userError: "Ezin izan da erabiltzailea balioztatu.",
        validPasswordError: "Ezin izan da pasahitza balioztatu.",
        accountError: "Kontua dagoeneko aktibatuta dago.",
        emailSubject: "Aktibazio estekaren eskaera",
        emailTextOne: "Kaixo ",
        emailTextTwo: ", Berriki, kontu berri bat aktibatzeko esteka eskatu duzu. Egin klik beheko estekan zure aktibazioa osatzeko: http://localhost:4200/eu/aktibatu/",
        emailHtmlOne: "Kaixo<strong> ",
        emailHtmlTwo: '</strong>,<br><br>Berriki, kontu berri bat aktibatzeko esteka eskatu duzu. Egin klik beheko estekan zure aktibazioa osatzeko:<br><br><a href="http://localhost:4200/eu/aktibatu/',
        emailHtmlThree: '">http://localhost:4200/eu/aktibatu/</a>',
        success: "Aktibazio esteka hona bidali da "
    },
    resetUsername: {
        emailProvidedError: "Posta elektonikoa ez da eman.",
        emailError: "Ez da posta elektronikoa aurkitu.",
        emailSubject: "Erabiltzaile izen eskaera.",
        emailTextOne: "Kaixo ",
        emailTextTwo: ", Berriki, zure erabiltzaile izena eskatu duzu. Mesedez, gorde ezazu zure fitxategietan: ",
        emailHtmlOne: "Kaixo<strong> ",
        emailHtmlTwo: "</strong>,<br><br>Berriki, zure erabiltzaile izena eskatu duzu. Mesedez, gorde ezazu zure fitxategietan: ",
        success: "Erabiltzaile izena posta elektronikoara bidali da!"
    },
    resetPassword: {
        tokenProvidedError: "Tokena ez da eman.",
        usernameError: "Erabiltzaile izena ez da aurkitu.",
        accountError: "Kontua oraindik ez da aktibatu.",
        emailSubject: "Berrezarri pasahitz eskaera",
        emailTextOne: "Kaixo ",
        emailTextTwo: ', Berriki, pasahitza berrezartzeko esteka eskatu duzu. Egin klik beheko estekan zure pasahitza berrezartzeko:<br><br><a href="http://localhost:4200/eu/pasahitz-berria/',
        emailHtmlOne: "Kaixo<strong> ",
        emailHtmlTwo: '</strong>,<br><br>Berriki, pasahitza berrezartzeko esteka eskatu duzu. Egin klik beheko estekan zure pasahitza berrezartzeko:<br><br><a href="http://localhost:4200/eu/pasahitz-berria/',
        emailHtmlThree: '">http://localhost:4200/eu/pasahitz-berria/</a>',
        success: "Pasahitza berrezartzeko, egiaztatu zure posta elekronikoko esteka.",
        expiredError: "Pasahitz esteka iraungi da.",

    },
    savePassword: {
        usernameProvidedError: "Erabiltzaile izena ez da eman.",
        passwordProvidedError: "Pasahitza ez da eman.",
        emailSubject: "Pasahitza berrezarri da",
        emailTextOne: "Kaixo ",
        emailTextTwo: ", Posta elektroniko honek jakinarazten dizu zure pasahitza berrezarri berria dela.",
        emailHtmlOne: "Kaixo<strong> ",
        emailHtmlTwo: "</strong>,<br><br>Posta elektroniko honek jakinarazten dizu zure pasahitza berrezarri berria dela.",
        success: "Pasahitza berrezarri da!"
    },
    usersImages: {
        usernamesError: "Erabiltzaile izenen zerrenda ez da eman."
    },
    headers: {
        tokenError: "Ez da tokena eman.",
        validError: "Token baliogabea."
    },
    renewToken: {
        usernameProvidedError: "Erabiltzaile izena ez da eman.",
        userError: "Erabiltzailea ez da aurkitu."
    },
    permission: {
        userError: "Erabiltzailea ez da aurkitu."
    },
    management: {
        usernameProvidedError: "Erabiltzaile izena ez da eman.",
        userError: "Erabiltzailea ez da aurkitu.",
        usersError: "Erabiltzaileak ez dira aurkitu."
    },
    authentication: {
        userError: "Erabiltzailea ez da aurkitu."
    },
    profile: {
        usernameProvidedError: "Erabiltzaile izena ez da eman.",
    },
    editUser: {
        usernameProvidedError: "Erabiltzailea ez da eman.",
        userError: "Erabiltzailea ez da aurkitu.",
        nameUpdated: "Izena eguneratu da!",
        usernameUpdated: "Erabiltzaile izena eguneratu da!",
        emailUpdated: "Posta elektronikoa egunertu da!",
        avatarUpload: "Erabiltzaile argazkia igo da",
        aboutYourselfUpdated: "Zuri buruz eguneratu da!",
        success: "Baimenak eguneratu dira",
    },
    //File upload
    fileUpload: {
        usernameProvidedError: "Erabiltzaile izena ez da eman.",
        imageProvidedError: "Irudia ez da eman.",
        bucketProvidedError: "Edukiontzia ez da eman.",
        nameProvidedError: "Irudiaren izena ez da eman.",
        uploadError: "Akatsa gertatu da irudiak igotzean!",
        uploadSuccess: "Irudiak ongi igo dira.",
        deleteError: "Akatsa gertatu da irudiak ezabatzean!",
        deleteSuccess: "Irudiak ongi ezabatu dira.",
        keyError: "Giltza eman behar duzu.",
        bucketError: "Irudiaren edukiontzaia eman behar duzu."
    },
    //newCategory
    newCategory: {
        idProvidedError: 'Ez da kategoriaren IDa eman.',
        titleProvidedError: "Kategoriaren izenburua beharrezkoa da.",
        descriptionProvidedError: "Kategoriaren deskribapena beharrezkoa da.",
        categoriesError: "Kategoria ez da aurkitu.",
        saveError: "Kategoria ezin da gorde. Errorea:",
        success: "Kategoria gorde da!"
    },
    //newEvent
    newEvent: {
        createdByProvidedError: "Ekintzaren sortzailea beharrezkoa da.",
        categoryIdProvidedError: "Kategoriaren IDa beharrezkoa da.",
        titleProvidedError: "Ekintzaren izenburua beharrezkoa da.",
        startProvidedError: "Ekintzaren hasiera beharrezkoa da.",
        endProvidedError: "Ekintzaren bukaera beharrezkoa da.",
        descriptionProvidedError: "Ekintzaren deskribapena beharrezkoa da.",
        saveError: "Ekintza ezin da gorde. Errorea:",
        success: "Ekintza gorde da!"
    },
    //newApplication
    newApplication: {
        usersProvidedError: "Aplikazioaren erabiltzaileak beharrezkoak dira.",
        titleProvidedError: "Aplikazioaren izenburua beharrezkoa da.",
        licenseNameProvidedError: "Aplikazioaren lizentzia beharrezkoa da.",
        conditionsProvidedError: "Aplikazioaren baldintzak beharrezkoak dira.",
        priceProvidedError: "Aplikazioaren prezioa beharrezkoa da.",
        expiredAtProvidedError: "Aplikazioaren iraungitze data beharrezkoa da.",
        imagesProvidedError: "Aplikazioaren irudia beharrezkoa da.",
        userError: "Erabiltzailea ez da aurkitu.",
        saveError: "Aplikazioa ezin da gorde. Errorea:",
        success: "Aplikazioa gorde da!"
    },
    //newService
    newService: {
        createdByProvidedError: "Zerbitzuaren sortzailea beharrezkoa da.",
        idProvidedError: 'Ez da zerbitzuaren IDa eman.',
        serviceTypeIdProvidedError: "Zerbitzu motaren IDa beharrezkoa da.",
        titleProvidedError: "Zerbitzuaren izenburua beharrezkoa da.",
        descriptionProvidedError: "Zerbitzuaren deskribapena beharrezkoa da.",
        latProvidedError: 'Latitudea ez da eman.',
        lngProvidedError: 'Luzeera ez da eman.',
        servicesError: "Zerbitzua ez da aurkitu.",
        saveError: "Zerbitzua ezin da gorde. Errorea:",
        success: "Zerbitzua gorde da!"
    },
    //newServiceType
    newServiceType: {
        idProvidedError: 'Ez da zerbitzu motaren IDa eman.',
        titleProvidedError: "Zerbitzu motaren izenburua beharrezkoa da.",
        serviceTypesError: "Zerbitzu mota  ez da aurkitu.",
        saveError: "Zerbitzu mota ezin da gorde. Errorea:",
        success: "Zerbitzu mota gorde da!"
    },
    //newObservation
    newObservation: {
        createdByProvidedError: "Oharraren sortzailea beharrezkoa da.",
        idProvidedError: 'Ez da oharraren IDa eman.',
        titleProvidedError: "Oharraren izenburua beharrezkoa da.",
        descriptionProvidedError: "Oharraren deskribapena beharrezkoa da.",
        observationsError: "Oharra ez da aurkitu.",
        saveError: "Oharra ezin da gorde. Errorea:",
        success: "Oharra gorde da!"
    },
    //newComment
    newComment: {
        eventIdProvidedError: "Ekintzaren IDa beharrezkoa da.",
        createdByProvidedError: "Iruzkinaren sortzailea beharrezkoa da.",
        commentProvidedError: "Iruzkina beharrezkoa da.",
        saveError: "Iruzkina ezin da gorde. Errorea:",
        success: "Iruzkina gorde da!"
    },
    newEventReaction: {
        idProvidedError: 'Ez da ekintzaren IDa eman.',
        reactionProvidedError: 'Ekintzaren erreakzioa ez da eman.',
        eventError: "Ekintza ez da aurkitu.",
        userError: "Erabiltzailea ez da aurkitu.",
        ownError: "Ezin diozu zeure publikazioari erreakziorik egin.",
        likedBeforeError: "Publicazio oni erreakzioa jada egin diozu. ",
        saveError: "Ezin izan da erreakzioa gehitu. Akatsa: ",
        success: "Erreakzioa gehitu da!"
    },
    //userEvents
    userEvents: {
        usernameProvidedError: "Ekintzen erabiltzailea ez da eman.",
        eventsError: "Ez dira ekintzak aurkitu.",
    },
    //userApplications
    userApplications: {
        usernameProvidedError: "Aplikazioen erabiltzailea ez da eman.",
        userError: "Erabiltzailea ez da aurkitu.",
        applicationsError: "Ez dira aplikazioak aurkitu."
    },
    //userServices
    userServices: {
        usernameProvidedError: "Zerbitzuen erabiltzailea ez da eman.",
        eventsError: "Ez dira zerbitzuak aurkitu.",
    },
    //usersSearch
    usersSearch: {
        searchTermProvidedError: "Bilaketa hitza ez da eman.",
        usersError: "Erabiltzaileak ez dira aurkitu.",
    },
    //eventsSearch
    eventsSearch: {
        searchTermProvidedError: "Bilaketa hitza ez da eman.",
        eventsError: "Ekintzak ez dira aurkitu.",
        placesError: "lekuak ez dira aurkitu."
    },
    //getEvent
    getEvent: {
        idProvidedError: "Ekintzaren IDa ez da eman.",
        eventError: "Ez da ekintza aurkitu.",
        placeError: "Ez da lekua aurkitu.",
        categoryError: "Ez da kategoria aurkitu."
    },
    //getApplication
    getApplication: {
        idProvidedError: 'Aplikazioaren IDa ez da eman.',
        applicationError: "Aplikazioa ez da aurkitu."
    },
    //getService
    getService: {
        idProvidedError: "Zerbitzuaren IDa ez da eman.",
        usernameProvidedError: "Zerbitzuaren erabiltzailea ez da eman.",
        userError: "Erabiltzailea ez da aurkitu.",
        serviceError: "Ez da zerbitzua aurkitu.",
        placeError: "Ez da lekua aurkitu."
    },
    //getObservation
    getObservation: {
        idProvidedError: "Oharraren IDa ez da eman.",
        usernameProvidedError: "Oharraren erabiltzailea ez da eman.",
        userError: "Erabiltzailea ez da aurkitu.",
        observationError: "Ez da oharra aurkitu."
    },
    //getComment
    getComment: {
        idProvidedError: "Iruzkinaren IDa ez da eman.",
        usernameProvidedError: "Iruzkinaren erabiltzailea ez da eman.",
        commentError: "Ez da iruzkina aurkitu."
    },
    //getPlacesCoordinates
    getPlacesCoordinates: {
        provinceProvidedError: 'Probintzia ez da eman.',
        municipalityProvidedError: 'Udalerria ez da eman.',
        placesError: "Lekuak ez dira aurkitu."
    },
    //newPlace
    newPlace: {
        eventIdProvidedError: 'Ekintzaren IDa beharrezkoa da.',
        provinceProvidedError: "Probintzia beharrezkoa da.",
        geonameIdProvinceProvidedError: "Probintziaren geoname ID beharrezkoa da.",
        municipalityProvidedError: "Udalerria beharrezkoa da.",
        geonameIdMunicipalityProvidedError: "Udalerriaren geoname ID beharrezkoa da.",
        latProvidedError: "Latitudea beharrezkoa da.",
        lngProvidedError: "Luzeera beharrezkoa da.",
        locationProvidedError: "Kokapena beharrezkoa da.",
        saveError: "Lekua ezin da gorde. Errorea:",
        success: "Lekua gorde da!"
    },
    singleTheme: {
        paramProvidedError: "Ez da gaiaren IDa eman.",
        themeError: "Ez da gaia aurkitu."
    },
    editCategory: {
        idProvidedError: 'Ez da kategoriaren IDa eman.',
        categoryError: "Kategoria ez da aurkitu.",
        userError: "Erabiltzailea ez da aurkitu.",
        permissionError: "Ez duzu kategoria hau aldatzeko baimenik.",
        saveError: "Ezin izan da kategoria eguneratu. Akatsa: ",
        success: "Kategoria eguneratu da!"
    },
    editEvent: {
        idProvidedError: 'Ez da ekintzaren IDa eman.',
        createdByProvidedError: 'Ekintzaren erabiltzailea ez da eman.',
        saveError: "Ezin izan da ekintza aldatu. Akatsa: ",
        success: "Ekintza aldatu da!"
    },
    editApplication: {
        idProvidedError: 'Ez da aplikazioaren IDa eman.',
        usersProvidedError: "Aplikazioaren erabiltzaileak ez dira eman.",
        saveError: "Ezin izan da aplikazioa aldatu. Akatsa: ",
        success: "Aplikazioa aldatu da!"
    },
    editService: {
        idProvidedError: 'Ez da zerbitzuaren IDa eman.',
        createdByProvidedError: 'Zerbitzuaren erabiltzailea ez da eman.',
        saveError: "Ezin izan da zerbitzua aldatu. Akatsa: ",
        success: "Zerbitzua aldatu da!"
    },
    editServiceType: {
        idProvidedError: 'Ez da zerbitzu motaren IDa eman.',
        serviceTypeError: "Zerbitzu mota ez da aurkitu.",
        userError: "Erabiltzailea ez da aurkitu.",
        permissionError: "Ez duzu zerbitzu mota hau aldatzeko baimenik.",
        saveError: "Ezin izan da zerbitzu mota eguneratu. Akatsa: ",
        success: "Zerbitzu mota eguneratu da!"
    },
    editObservation: {
        idProvidedError: 'Ez da oharraren IDa eman.',
        createdByProvidedError: 'Oharraren erabiltzailea ez da eman.',
        saveError: "Ezin izan da oharra aldatu. Akatsa: ",
        success: "Oharra aldatu da!"
    },
    editComment: {
        idProvidedError: 'Ez da iruzkinaren IDa eman.',
        usernameProvidedError: 'Erabiltzaile izena ez da eman.',
        createdByProvidedError: 'Iruzkinaren erabiltzailea ez da eman.',
        commentProvidedError: 'Iruzkina ez da eman.',
        saveError: "Ezin izan da iruzkina aldatu. Akatsa: ",
        success: "Iruzkina aldatu da!"
    },
    deleteCategory: {
        idProvidedError: 'Ez da kategoriaren IDa eman.',
        deleteError: "Ezin izan da kategoria ezabatu, ekintza batek erabiltzen du.",
        saveError: "Ezin izan da kategoria ezabatu. Akatsa: ",
        success: "Kategoria ezabatu da!"
    },
    deleteEvent: {
        usernameProvidedError: 'Erabiltzaile izena ez da eman.',
        idProvidedError: 'Ez da ekintzaren IDa eman.',
        saveError: "Ezin izan da ekintza ezabatu. Akatsa: ",
        success: "Ekintza ezabatu da!"
    },
    deleteApplication: {
        usernameProvidedError: 'Erabiltzaile izena ez da eman.',
        idProvidedError: 'Ez da ekintzaren IDa eman.',
        saveError: "Ezin izan da ekintza ezabatu. Akatsa: ",
        success: "Ekintza ezabatu da!"
    },
    deleteService: {
        usernameProvidedError: 'Erabiltzaile izena ez da eman.',
        idProvidedError: 'Ez da zerbitzuaren IDa eman.',
        deleteError: "Ezin izan da zerbitzua ezabatu, beste aplikazio batek erabiltzen du.",
        saveError: "Ezin izan da zerbitzua ezabatu. Akatsa: ",
        success: "Zerbitzua ezabatu da!"
    },
    deleteServiceType: {
        idProvidedError: 'Ez da zerbitzu motaren IDa eman.',
        saveError: "Ezin izan da zerbitzu mota ezabatu. Akatsa: ",
        success: "Zerbitzu mota ezabatu da!"
    },
    deleteObservation: {
        usernameProvidedError: 'Erabiltzaile izena ez da eman.',
        idProvidedError: 'Ez da oharraren IDa eman.',
        deleteError: "Ezin izan da oharra ezabatu, beste aplikazio batek erabiltzen du.",
        saveError: "Ezin izan da oharra ezabatu. Akatsa: ",
        success: "Oharra ezabatu da!"
    },
    deleteComment: {
        usernameProvidedError: 'Erabiltzaile izena ez da eman.',
        idProvidedError: 'Ez da iruzkinaren IDa eman.',
        success: "Iruzkina ezabatu da!"
    },
    deleteEventReaction: {
        idProvidedError: 'Ez da ekintzaren IDa eman.',
        eventError: "Ekintza ez da aurkitu.",
        userError: "Erabiltzailea ez da aurkitu.",
        ownError: "Ezin diozu zeure publicazioari erreakziorik egin.",
        quitBeforeError: "Ekintza hau erreakzionatzeari utzi diozu",
        saveError: "Ezin izan da erreakzioa ezabatu. Akatsa: ",
        success: "Erreakzioa ezabatu da!"
    },
    comments: {
        commentsError: "Ez da iruzkinik aurkitu."
    }
};