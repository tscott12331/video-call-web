export function getCookie(cookieString: string, name: string) {
    const potCookie = cookieString.split('; ').find((cookie) => cookie.startsWith(name));
    if(!potCookie) return undefined;
    
    // prevent false matching with leading characters after name
    // Ex: matching name "token=" with the cookie "token"
    const potCookieSplit = potCookie.split('=');
    if(!potCookieSplit[0].startsWith(name)) return undefined;
    potCookieSplit.splice(0, 1);

    // get full value of cookies with "=" in it
    const cookieValue = potCookieSplit.join('');
    return cookieValue;
}
