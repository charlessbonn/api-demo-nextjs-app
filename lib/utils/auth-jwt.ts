import jwt from 'jsonwebtoken';
import { MyConfig } from './config';
import { JWTUSERDATAMODEL, USERDATAMODEL } from '../interfaces/user';

////////////////////////////////
// USER
////////////////////////////////

// Generate a JWT token
export const authGenerateUserToken = (user: USERDATAMODEL) => {
    const token = jwt.sign({ user }, (MyConfig.jwtSecret ?? "N/A"), {
        expiresIn: '12h', // The token expires in 1 hour
    });
    return token;
};

// Generate a temporary JWT token
export const authGenerateTempUserToken = (user: USERDATAMODEL) => {
    const token = jwt.sign({ user }, (MyConfig.jwtSecret ?? "N/A"), {
        expiresIn: '10m', // The token expires in 1 hour
    });
    return token;
};

// Verify a JWT token
export const authVerifyUserToken = (token: string): JWTUSERDATAMODEL => {
    token = token.slice(7, token.length);
    const decoded = jwt.verify(token, MyConfig.jwtSecret ?? "N/A") as JWTUSERDATAMODEL;
    return decoded;
};

// Verify a JWT token
export const authVerifyRawUserToken = (token: string): JWTUSERDATAMODEL => {
    // token = token.slice(7, token.length);
    const decoded = jwt.verify(token, MyConfig.jwtSecret ?? "N/A") as JWTUSERDATAMODEL;
    return decoded;
};