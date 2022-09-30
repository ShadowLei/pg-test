

const config = require("../config.json");

import random from 'string-random';
import { Pool, PoolClient, QueryResult } from "pg";

class MyPgTest {
    pool: Pool;
}

let p = new MyPgTest();
p.pool = new Pool(config.db);

//[0, max]
function randomNum(max: number = 100): number {
    let rtn = Math.floor(Math.random() * (max + 1));
    return rtn;
}


function getRandomString(digit?: number, options?: random.Options | string | true): string {
    options = options || { numbers: true, letters: true, specials: false };
    return random(digit || 32, options);
}

function getRandomDigitString(digit?: number): string {
    let options = { numbers: true, letters: false, specials: false };
    return random(digit || 32, options);
}

async function exec(sql: string, vals: Array<any>): Promise<any> {
    let client: PoolClient = null;

    try {
        client = await p.pool.connect();
        let rtn = await client.query(sql, vals);
        return rtn;
    }
    catch (e) {
        console.log(e);
    }
    finally {
        if (client) { client.release(); }
    }
}

async function insert(): Promise<any> {
    let sql = "insert into pg_test (val, detail) values ($1, $2);"
    
    return exec(sql, [randomNum(), {
        a: 1,
        b: 2,
        my_test: {
            a: 1,
            str: getRandomString(randomNum()),
            qq: getRandomString(randomNum()),
            date: new Date()
        }
    }]);
}

async function update(): Promise<any> {
    let sql = "update pg_test set val = $1 where id = $2"
    
    return exec(sql, [randomNum(), randomNum()]);
}


async function select(): Promise<QueryResult<any>> {
    let sql = "select * from pg_test as pg1 inner join pg_test as pg2 on pg1.val = pg2.val where pg2.detail->'my_test'->>'str' like $1"
    
    return exec(sql, [getRandomString(randomNum(5)) + "%"]);
}

async function test(): Promise<any> {
    await insert();
    await select();
    await update();
    await select();
}

async function test_concurrent(times: number) {

    console.log(`Start: ${times}`);

    let complete = 0;

    for (let i = 0; i < times; i++) {
        test()
        .then(_ => {
            complete++;
            console.log(`complete: ${complete}`);
        });
    }
}

async function prepare(times: number) {
    let complete = 0;
    for (let i = 0; i < times; i++) {
        insert()
        .then(_ => {
            complete++;
            console.log(`complete: ${complete}`);
        });
    }
}

//1. prepare:
//prepare(20000);

//2. run test
test_concurrent(200);
