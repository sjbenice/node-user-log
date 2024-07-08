const express = require('express');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
// const axios = require('axios');

const serviceUser = require('./users');
// const serviceHistory = require('./history');
const serviceHistory = require('./../../dist/history');

const router = express.Router();

const myCache = new NodeCache({ stdTTL: 6000 }); // Cache for 100 minutes

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply the rate limiting middleware to all requests
router.use(limiter);

function fetchData(fetchFunction, cacheKey) {
    return new Promise((resolve, reject) => {
        let data = myCache.get(cacheKey);
        if (data) {
            resolve(data);
        } else {
            fetchFunction().then(data => {
                myCache.set(cacheKey, data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        }
    });
}

import('queue').then(queueModule => {
    const Queue = queueModule.default;
    const apiQueue = new Queue({ concurrency: 1, autostart: true });

    // Endpoint to post user
    // /api/user
    router.post('/user', async (req, res) => {
        try {
            serviceUser.postUser(req.body)
            .then((result) => {
                if (result) {
                    serviceHistory.postAction({user_id:result["id"], action:"add"});
                    res.status(200).send(result);// JSON.stringify
                } else {
                    res.status(400).send({error:"db error"});
                }
            })
            .catch((error) => {
                res.status(400).send({error:error});
            });
        } catch (error) {
            res.status(400).send({error:error});
        }
    });

    // PUT/update an existing user by ID
    router.put('/user/:id', async (req, res) => {
        try {
            serviceUser.putUser(req.params.id, req.body)
            .then((result) => {
                if (result) {
                    serviceHistory.postAction({user_id:result["id"], action:"update"});
                    res.status(200).send(result);// JSON.stringify
                } else {
                    res.status(400).send({error:"db error"});
                }
            })
            .catch((error) => {
                res.status(400).send({error:error});
            });
        } catch (error) {
            res.status(400).send(error);
        }
    });

    // Endpoint to get users
    // /api/users/{page_num},{per_page_count}
    router.get('/users/:page_num,:per_page_count', (req, res) => {
        const { page_num, per_page_count } = req.params;
        const cacheKey = `users-${page_num}-${per_page_count}`;

        apiQueue.push(async () => {
            try {
                const data = await fetchData(() => serviceUser.getByPage(page_num, per_page_count), cacheKey);
                res.json(data);
            } catch (error) {
                res.status(500).json({ error: 'Internal server error', details: error.message });
            }
        });
    });

    // Endpoint to history action
    // /api/history
    router.post('/history', async (req, res) => {
        try {
            serviceHistory.postAction(req.body)
            .then((result) => {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(400).send({error:"db error"});
                }
            })
            .catch((error) => {
                res.status(400).send({error:error});
            });
        } catch (error) {
            console.log(error)
            res.status(400).send({error:error});
        }
    });

    // Endpoint to get histroy data from page number with per page count for user
    // /api/history/{user_id},{page_num},{per_page_count}
    router.get('/history/:user_id,:page_num,:per_page_count', (req, res) => {
        const { user_id, page_num, per_page_count } = req.params;
        const cacheKey = `history-${user_id}-${page_num}-${per_page_count}`;

        apiQueue.push(async () => {
            try {
                const data = await fetchData(() => serviceHistory.getByPage(user_id, page_num, per_page_count), cacheKey);
                res.json(data);
            } catch (error) {
                res.status(500).json({ error: 'Internal server error', details: error.message });
            }
        });
    });
    
}).catch(error => {
    console.error('Error loading module:', error);
});
  
module.exports = router;
