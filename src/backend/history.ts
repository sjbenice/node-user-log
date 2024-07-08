import pool from './db';

async function postAction(reqBody:any) {
    const { user_id, action } = reqBody;
    try {
        if (user_id && action) {
            const result = await pool.query('INSERT INTO history (user_id, action) VALUES($1, $2) RETURNING *', [user_id, action]);
            if (result){
                console.log('Action has been logged to the database', result.rows[0]);
                return { id: result.rows[0]["id"] };
            }
        }
    } catch (error) {
        console.error('Error executing query', error);
    }
}

async function getByPage(userId:string, pageNum:string, perCount:string) {
    try {
        const user_id:number = parseInt(userId, 10);
        const page_num:number = parseInt(pageNum, 10);
        const per_page_count:number = parseInt(perCount, 10);
        if (user_id > 0 && page_num >= 0 && per_page_count > 0){
            const offset:number = page_num * per_page_count;

            const results = await pool.query(`SELECT * FROM history WHERE user_id=$1 OFFSET $2 LIMIT $3;`,
                                                    [user_id, offset, per_page_count]);
            const data:any = {};
            data['data'] = results.rows;
            const results2 = await pool.query(`SELECT count(*) FROM history WHERE user_id=$1;`, [user_id]);
            data['total'] = results2.rows[0]['count'];

            return (data);//JSON.stringify
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return ''; // Returning empty string if conditions are not met
}

export { getByPage, postAction };
