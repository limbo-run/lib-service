import jwt from "jsonwebtoken";
import {setting} from "..";

export const authorized = (...roles: string[]) => async (req, res, context) => {
    const token = getTokenFromHeader(req) || getTokenFromQuery(context.query);
    try {
        context.session = jwt.verify(
            token,
            setting('AUTH_JWT_SECRET')
        ) as any;

        roles.forEach(role => {
            if (!context.session.role.includes(role)) {
                throw {
                    code: 403,
                    status: 'forbidden',
                    payload: "missing role"
                }
            }
        })
    } catch (e) {
        throw {
            code: 403,
            status: 'error',
            payload: e.message
        };
    }
}

function getTokenFromHeader(req) {
    let header = req.headers.authorization;
    if (!header) {
        return;
    }

    return header.substring(8);
}

function getTokenFromQuery(query) {
    let token = query.token;
    if (!token) {
        return;
    }

    return token;
}
