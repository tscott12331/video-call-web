import { jwtVerify, SignJWT, importPKCS8, importSPKI } from "jose";

const alg = 'RS256'

const pkcs8: string = process.env.PR_KEY as string;
const spki: string = process.env.PU_KEY as string;



export const createSignedJWT = async (username: string) => {
    const pkey = await importPKCS8(pkcs8, alg);
    return await new SignJWT({ username })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(pkey);
}

export const verifyJWT = async (jwt: string) => {
    try {
        const pubkey = await importSPKI(spki, alg);
        return await jwtVerify(jwt, pubkey);
    } catch(err) {
        return false;
    }
}
