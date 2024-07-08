const pool = require('./db');

async function getByPage(page_num, per_page_count) {
    try {
        page_num = parseInt(page_num, 10);
        per_page_count = parseInt(per_page_count, 10);
        if (page_num >= 0 && per_page_count > 0){
            offset = page_num * per_page_count;

            const results = await pool.query(`SELECT * FROM users OFFSET $1 LIMIT $2;`,
                                                    [offset, per_page_count]);
            data = {};
            data['data'] = results.rows;
            const results2 = await pool.query(`SELECT count(*) FROM users;`);
            data['total'] = results2.rows[0]['count'];

            return JSON.stringify(data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function postUser(reqBody) {
    const { name, email } = reqBody;
    try {
        if (name && email) {
            const result = await pool.query('INSERT INTO users(name, email) VALUES($1, $2) RETURNING *', [name, email]);
            if (result){
                console.log('User has been added to the database', result.rows[0]);
                return { id: result.rows[0]["id"] };
            }
        }
    } catch (error) {
        console.error('Error executing query', error);
    }
}

async function putUser(userId, reqBody) {
    const user_id = parseInt(userId, 10);
    const { name, email } = reqBody;
    try {
        if (user_id && name && email) {
            const result = await pool.query('UPDATE users SET name=$2, email=$3 WHERE id=$1 RETURNING *', [user_id, name, email]);
            if (result){
                console.log('User has been updated to the database', result.rows[0]);
                return { id: result.rows[0]["id"] };
            }
        }
    } catch (error) {
        console.error('Error executing query', error);
    }
}

module.exports = {
    getByPage,
    postUser,
    putUser,
};
