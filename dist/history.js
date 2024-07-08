"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAction = exports.getByPage = void 0;
const db_1 = require("./db");
function postAction(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, action } = reqBody;
        try {
            if (user_id && action) {
                const result = yield db_1.default.query('INSERT INTO history (user_id, action) VALUES($1, $2) RETURNING *', [user_id, action]);
                if (result) {
                    console.log('Action has been logged to the database', result.rows[0]);
                    return { id: result.rows[0]["id"] };
                }
            }
        }
        catch (error) {
            console.error('Error executing query', error);
        }
    });
}
exports.postAction = postAction;
function getByPage(userId, pageNum, perCount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = parseInt(userId, 10);
            const page_num = parseInt(pageNum, 10);
            const per_page_count = parseInt(perCount, 10);
            if (user_id > 0 && page_num >= 0 && per_page_count > 0) {
                const offset = page_num * per_page_count;
                const results = yield db_1.default.query(`SELECT * FROM history WHERE user_id=$1 OFFSET $2 LIMIT $3;`, [user_id, offset, per_page_count]);
                const data = {};
                data['data'] = results.rows;
                const results2 = yield db_1.default.query(`SELECT count(*) FROM history WHERE user_id=$1;`, [user_id]);
                data['total'] = results2.rows[0]['count'];
                return (data); //JSON.stringify
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
        return ''; // Returning empty string if conditions are not met
    });
}
exports.getByPage = getByPage;
