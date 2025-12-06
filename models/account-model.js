const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const sql = `
            SELECT account_id, account_firstname, account_lastname, 
                account_email, account_type, account_password
            FROM account 
            WHERE account_email = $1
        `;
        const result = await pool.query(sql, [account_email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }   catch (error) {
        console.error("Error en getAccountByEmail:", error);
        throw error;
    }
}

async function getAccountById(account_id) {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM public.account WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows[0]
}

async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
    const sql = `
        UPDATE public.account
        SET account_firstname = $1, account_lastname = $2, account_email = $3
        WHERE account_id = $4
        RETURNING account_id
    `
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return data.rowCount > 0
}

async function updatePassword(account_id, hashedPassword) {
    const sql = `
        UPDATE public.account
        SET account_password = $1
        WHERE account_id = $2
    `
    const data = await pool.query(sql, [hashedPassword, account_id])
    return data.rowCount > 0
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountInfo, updatePassword} 