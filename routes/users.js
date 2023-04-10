const express = require('express');
const usersList = require("../users-list");
const router = express.Router();

/* GET users listing */
router.get('/', function (req, res, next) {
    const searchText = req.query.searchText || '';
    const perPage = parseInt(req.query.perPage ?? 10);
    const page = parseInt(req.query.page ?? 1);

    let users = [];

    if (searchText) {
        users = usersList.users.filter(({ first_name, last_name }) => {
            return first_name.includes(searchText) || last_name.includes(searchText);
        });
    } else {
        users = usersList.users.slice();
    }

    const pages = Math.ceil(users.length / perPage);
    const from = (page - 1) * perPage;
    const to = from + perPage;
    const list = users.length > perPage ? users.slice(from, to) : users;

    res.json({
        page: page,
        perPage: perPage,
        pages,
        items: list
    });
});

/* GET user details */
router.get('/:id', function (req, res, next) {
    try {
        const userId = req.params.id;
        const user = usersList.users.find(({ id }) => +id === +userId);

        res.json(user);
    } catch (err) {
        res.json({ error: err.message || err.toString() });
    }
});

/* POST new user */
router.post('/', function (req, res, next) {
    let lastId = usersList.users.reduce((id, user) => id = id < user.id ? user.id : id, 0);
    const newUser = {
        ...req.body,
        id: ++lastId
    };
    usersList.users.push(newUser);
    res.status(201).json(newUser);
});

/* POST new user */
router.put('/:id', function (req, res, next) {
    try {
        const userId = req.params.id;
        let userIndex = usersList.users.findIndex(({ id }) => +id === +userId);
        usersList.users.splice(userIndex, 1, req.body);

        res.status(201).json(req.body);
    } catch (err) {
        res.json({ error: err.message || err.toString() });
    }
});

module.exports = router;
