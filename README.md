# Exam #1: "Piano degli studi"
## Student: s302056 BELARDO ANNA LISA 

## React Client Application Routes

- Route  ` / `: home-page dove si possono vedere tutti i corsi offerti dall'università. Route non protetta dall'autenticazione dell'utente. Dopo il login, la stessa route diventa home-page loggedIn dove l'utente può continuare a vedere la stessa lista completa dei corsi. 
- Route `/login`: Route dove c'è il modulo di login per effettuare l'autenticazione.
- Route `/studyPlan`: Route accessibile solo dopo che l'utente si è autenticato. Fa parte delle Protected Route. Qui si può vedere un piano di studio, se già esistente, oppure crearne uno nuovo. 
- Route `/studyPlan/edit`: Pagina di editing. Accessibile solo dopo che l'utente si è autenticato. Fa parte delle Protected Route. Qui, l'utente può modificare il proprio piano di studio,se già esistente, aggiungendo o eliminando corsi presi dall'offerta formativa.
- Route `/*`: Qualsiasi altro percorso è associato a questa Route nella quale l'applicazione mostra una pagina con not found error.


## API Server
Di seguito sono riportate le API HTTP progettate ed implementate nel progetto.

#### **`POST /api/sessions`**

Esegue l'autenticazione utente e crea una nuova sessione per l'utente.

**Request header:**

`Content-Type: application/json`

**Request body:**

JSON object contenente username e password.

```
{
    "username": "user1@polito.com" ,
    "password": "password"
}
```

**Response body**

`HTTP status code 200 OK`

```
{
    "id": 1,
    "email": "user1@polito.com",
    "name": "User1"
}
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (credentials error)



#### **`DELETE /api/sessions/current`**

Esegue il logout dell'utente ed elimina la sessione utente corrente.

**Request header:**

`Session: req.user per ottenere l'id dell'utente loggato`

**Response body**

`HTTP status code 200 OK`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)


#### **`GET /api/sessions/current`**

Prende le informazioni dell'utente se è loggato.

**Request header:**

`Session: req.user per ottenere l'id dell'utente loggato`

**Response body**

`HTTP status code 200 OK`

```
{
    "id": 1,
    "email": "user1@polito.com",
    "name": "User1"
}
```
 **Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (user not found error)
- `HTTP status code 401 Unauthorized` (authentication error)



#### **`GET /api/courses/all`**

Si ottiene un array con le informazioni di tutti i corsi offerti, incluse le incompatibilità. La visualizzazione dei corsi è ordinata per nome. 


**Response body**

`HTTP status code 200 OK`

```
[
    {
        "Code": "01UDFOV",
        "Nome": "Applicazioni Web I",
        "CFU": 6,
        "Max_Studenti": null,
        "Propedeuticità": {
            "Code": null,
            "Name": null
        },
        "Iscritti": 0,
        "code": "01UDFOV",
        "incompatibilita": [
            {
                "Code": "01TXYOV",
                "Name": "Web Applications I"
            }
        ]
    },
  ....
  ]
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` ("Non sono stati trovati corsi")



#### **`GET /api/study-plan`**

Ottieni informazioni sul piano studio di un utente quando è loggato inclusa la lista dei corsi e le informazioni sulla tipologia scelta.

**Request header:**

`Session: req.user per ottenere l'id dell'utente loggato`

**Response body**

`HTTP status code 200 OK`

```
{
    "ID": 32,
    "ID_List": 1,
    "Crediti": 23,
    "type": {
        "Nome": "Part-time",
        "Max_Credits": 40,
        "Min_Credits": 20
    },
    "courses": [
        "01UDFOV",
        "02GOLOV",
        "03UEWOV"
    ]
}
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` ("L'utente non ha un piano di studio")
- `HTTP status code 401 Unauthorized` (authentication error)



#### **`GET /api/study-plan/type`**

Ottieni informazioni sui tipi di piano di studio. Azione possibile solo dopo l'autenticazione. 

**Request header:**

`Session: req.user per ottenere l'id dell'utente loggato`

**Response body**

`HTTP status code 200 OK`

```
[
    {
        "ID": 1,
        "Nome": "Full-time",
        "Max_Credits": 80,
        "Min_Credits": 60
    },
    {
        "ID": 2,
        "Nome": "Part-time",
        "Max_Credits": 40,
        "Min_Credits": 20
    }
]
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` ("Non ci sono tipi")
- `HTTP status code 401 Unauthorized` (authentication error)


#### **`POST /api/study-plan/add`**

Crea un piano di studio,per la prima volta, associato ad un utente loggato. Inoltre crea e riempie la lista dei corsi e aggiorna il numero di studenti iscritti ad ogni corso. 


**Request header:**

- `Session: req.user per ottenere l'id dell'utente loggato`
- `Content-Type: application/json`

 **Request body:**

Un oggetto JSON  contentente i dati del piano di studio da inserire.

```
{
    "courses": ["01TYMOV", "01UDUOV"],
    "ID_Type": "2",
    "Crediti": "24"
}
```

**Response body**

`HTTP status code 200 OK`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (authentication error)



#### **`PUT api/study-plan/:id`**

Modifca un piano di studio associato ad un utente loggato, passando l'id del piano di studio già esistente. Inoltre aggiorna il numero di studenti iscritti ad ogni corso. 

**Request header:**

- `Session: req.user per ottenere l'id dell'utente loggato`
- `Params: req.params.id per ottenere l'id del piano di studio`
- `Content-Type: application/json`

**Request body:**

Un oggetto JSON  contentente i dati delle modifiche da apportare.

```
{
    "oldCourses": ["01TYMOV", "01UDUOV"],
    "newCourses": ["01SQOOV","01TXYOV","01UDUOV"],
    "Crediti": "24"
}
```

**Response body**

`HTTP status code 200 OK`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 404 Not Found` (study plan not found error)
- `HTTP status code 401 Unauthorized` (authentication error)


#### **`DELETE /api/study-plan/:id`**

Cancella un piano di studio associato ad un utente loggato, passando l'id del piano studio. Inoltre aggiorna il numero di studenti iscritti ad ogni corso.


**Request header:**

- `Session: req.user per ottenere l'id dell'utente loggato`
- `Params: req.params.id per ottenere l'id del piano di studio`

**Response body**

`HTTP status code 200 OK`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 404 Not Found` (study plan not found error)
- `HTTP status code 401 Unauthorized` (authentication error)



## **Database Tables**

- **COURSE**: contiene le informazioni dei corsi offerti.
```
 COURSE (
	"Code"
	"Nome"
	"CFU"	
	"Max_Studenti"	
	"Propedeuticità"	
	"Iscritti"
	PRIMARY KEY("Code"),
	FOREIGN KEY("Propedeuticità") REFERENCES "COURSE"("Code")
);
```
- **INCOMPATIBILITY**: contiene le informazioni sulle incompatibilità tra corsi.
```
INCOMPATIBILITY (
	"ID"
	"Course_Code"	
	"Incomp_Code"
	UNIQUE("Course_Code","Incomp_Code"),
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("Incomp_Code") REFERENCES "COURSE"("Code"),
	FOREIGN KEY("Course_Code") REFERENCES "COURSE"("Code")
);
```
- **LIST_COURSES**: contiene le informazioni sulla lista dei corsi associata ad un piano studio.
```
 LIST_COURSES (
	"ID"	
	"Code"	
	PRIMARY KEY("ID","Code"),
	FOREIGN KEY("Code") REFERENCES "COURSE"("Code")
);
```
- **STUDY_PLAN**: contiene le informazioni di un piano studio.
```
STUDY_PLAN (
	"ID"
	"ID_List"
	"ID_Type"
	"ID_User"
	"Crediti"
	PRIMARY KEY("ID" AUTOINCREMENT),
	UNIQUE("ID_User","ID_List"),
	FOREIGN KEY("ID_User") REFERENCES "USER"("ID"),
	FOREIGN KEY("ID_Type") REFERENCES "TYPE_STUDY_PLAN"("ID")
);
```
- **TYPE_STUDY_PLAN**: contiene le informazioni relative alle tipologie dei vari piani studio.
```
TYPE_STUDY_PLAN (
	"ID"
	"Nome"
	"Max_Credits"
	"Min_Credits"
	PRIMARY KEY("ID" AUTOINCREMENT)
);
```
- **USER**: contiene le informazioni degli utenti.
```
USER (
	"ID"
	"Email"
	"Nome"
	"Password"
	"Salt"
	PRIMARY KEY("ID" AUTOINCREMENT)
);
```


## Main React Components

### **Components**
- `Course` (in `components/Course.jsx`): componente che gestisce la visualizzazione dei corsi, con tutte le informazioni associate,sia nella home-page senza autenticazione e sia nella home page loggedIn. Inoltre qui, quando si arriva nella sezione di editing, si gestiscono i bottoni di add e remove di un corso dal piano di studio. 
- `LoginForm` (in `components/LoginForm.jsx`): componente che gestisce il form per il login e chiama l'api associata al submit.
- `ConfirmationModal` (in `components/ConfirmationModal.jsx`): componente che mostra un modal per richiedere la conferma all'utente in caso di SAVE o DELETE di un piano studio. 

### **Views**
- `StudyPlan` (in `views/StudyPlan.jsx`): componente che mostra il piano studio di un utente e che gestisce la creazione e l'eliminazione dello stesso.

- `EditPlan` (in `views/EditPlan.jsx`): componente che mostra la pagina di editing, con lista dei corsi attualmente presenti nel proprio piano studio (che possono essere rimossi) e i corsi che eventualmente si possono ancora selezionare. Inoltre esegue controlli (lato client) sui vincoli da rispettare, disabilitando i corsi che non li rispettano. 


## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

| email               | password | name     | Type of Study Plan|
| --------------------| -------- | -------- |-----|
| user1@polito.com    | password | User1    |Part-time|
| user2@polito.com    | password | User2    |Full-time|
| user3@polito.com    | password | User3    |Part-time|
| user4@polito.com    | password | User4    ||
| user5@polito.com    | password | User5    ||
