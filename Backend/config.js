import dotenv from "dotenv";
dotenv.config()
const JWT_USER_PASSWORD= process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SCRET_KEY="sk_test_51RJDRSQ7CkXEwtPDUTiDZRT85aJc14yR76bNMsP2Uec1fpieGvKX9BI8iei7HT4UFa88NRohoFXk5wu4KIMmgtnM00jVg2H9pd"

export default{
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SCRET_KEY
}