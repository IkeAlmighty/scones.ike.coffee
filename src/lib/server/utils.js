import { PRIVATE_BACKBLAZE_KEY } from '$env/static/private';
import { PUBLIC_BACKBLAZE_ID } from '$env/static/public';
import { json } from '@sveltejs/kit'
import crypto from 'crypto';
import fs from 'fs'

async function auth_b2_json() {
    // first, authorize the backblaze requests:
    const res = await fetch(`https://api.backblazeb2.com/b2api/v3/b2_authorize_account`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${PUBLIC_BACKBLAZE_ID}:${PRIVATE_BACKBLAZE_KEY}`)
        }
    });

    if (!res.ok) {
        throw new Error('failed to authenticate backblaze api.')
    }
    else {
        const result = await res.json();
        return result;
    }
}

async function generateSHA1Hash(file) {

    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha1');
        const stream = new ReadableStream(file);

        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (err) => reject(err));
    });
}

export { auth_b2_json, generateSHA1Hash }