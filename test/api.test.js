require('dotenv').config({ path: './.env' })
const request = require('supertest');
const app = require('../src/index'); // Import your Express app

let chai, expect;

const randomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}
  
describe('POST /api/user', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });
    it('Add user', async function() {
        this.timeout(5000);

        let result = randomString(10);

        const res = await request(app)
        .post('/api/user')
        .send({ name: result, email: result + '@gmail.com' });
        expect(res.statusCode).to.equal(200);

        console.log(res.text)
    });
});

describe('PUT /api/user/:id', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });
    it('it should update a user', async function() {
        this.timeout(5000);

        let result = randomString(10);

        const res = await request(app)
        .put('/api/user/' + (Math.floor(Math.random() * 10) + 1))
        .send({ name: result, email: result + '@gmail.com' });
        expect(res.statusCode).to.equal(200);

        console.log(res.text)
    });
});

describe('GET /api/users/:page_num,:per_page_count', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });
    it('should return a list of users with the ability to paginate', async function() {
        this.timeout(5000);

        const res = await request(app).get('/api/users/0,10');

        expect(res.statusCode).to.equal(200);
        console.log(res._body);
    });
});

describe('POST /api/history', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });
    it('Add log', async function() {
        this.timeout(5000);

        const res = await request(app)
        .post('/api/history')
        .send({ user_id: 1, action: 'add' });
        expect(res.statusCode).to.equal(200);

        console.log(res.text)
    });
});

describe('GET /api/history/:user_id,:page_num,:per_page_count', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });
    it('should return a list of action history with the ability to paginate', async function() {
        this.timeout(5000);

        const res = await request(app).get('/api/history/1,0,10');

        expect(res.statusCode).to.equal(200);
        console.log(res._body);
    });
});
