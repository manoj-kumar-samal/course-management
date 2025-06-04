import dotenv from "dotenv";
dotenv.config()
const JWT_USER_PASSWORD= process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY = "sk_test_51RJDRSQ7CkXEwtPDUTiDZRT85aJc14yR76bNMsP2Uec1fpieGvKX9BI8iei7HT4UFa88NRohoFXk5wu4KIMmgtnM00jVg2H9pd"
const GMAIL_USER=process.env.GMAIL_USER;
const GMAIL_PASS=process.env.GMAIL_PASS;

export default{
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY,
    GMAIL_USER,
    GMAIL_PASS
}