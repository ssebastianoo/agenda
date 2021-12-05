const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');

let config;
try {
    config = require('./config');
} catch (e) {
    config = {
        port: process.env.PORT,
        user: process.env.user,
        password: process.env.password,
        agenda: {
            from: process.env.agenda_from,
            to: process.env.agenda_to
        }
    }
}

const url = 'https://web.spaggiari.eu/rest/v1';
let userid;
const headers = {
    'User-Agent': 'zorro/1.0',
    'Z-Dev-Apikey': '+zorro+',
    'Content-Type': 'application/json'
}

const months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
}

fetch(url + '/auth/login', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
        ident: null,
        pass: config.password,
        uid: config.user,
    })
}).then(res => res.json()).then(res => {
    headers['Z-Auth-Token'] = res.token;
    userid = res.ident.replace(/[^.\d]/g, '');;

    console.log('Logged in with these info\n\n' + JSON.stringify(res, null, 4));
}).catch(err => {
    console.log(err);
});

async function getAgenda() {
    let res = await fetch(url + '/students/' + userid + '/agenda/all/'+ config.agenda.from + '/' + config.agenda.to, {headers: headers});
    return (await res.json()).agenda;
}

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', async (req, res) => {
    if (!headers['Z-Auth-Token']) { return res.send('getting ready, try in a few seconds');}
    let agenda = await getAgenda();
    agenda.forEach(item => {
        let date = new Date(item.evtDatetimeBegin);
        item.time = date.getDate() + ' ' + months[date.getMonth() + 1].substr(0,3) + ' ' + date.getFullYear();
    });
    res.render('index', {agenda: agenda});
});

app.get('/json', async (req, res) => {
    if (!headers['Z-Auth-Token']) { return res.send('getting ready, try in a few seconds');}
    let agenda = await getAgenda();
    res.send(agenda);
});

app.listen(config.port, () => {
    console.log('-> http://localhost:' + config.port);
});