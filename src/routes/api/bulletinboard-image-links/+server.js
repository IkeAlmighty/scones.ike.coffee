import { PRIVATE_BACKBLAZE_KEY } from '$env/static/private';
import { PUBLIC_BACKBLAZE_ENDPOINT, PUBLIC_BACKBLAZE_ID } from '$env/static/public';
import { json } from '@sveltejs/kit'
export const GET = async ({ request }) => {

    console.log(PRIVATE_BACKBLAZE_KEY);
    console.log(PUBLIC_BACKBLAZE_ID);

    // first, authorize the backblaze requests:
    const res = await fetch(`${PUBLIC_BACKBLAZE_ENDPOINT}/b2api/v3/b2_authorize_account`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + Buffer.from(PUBLIC_BACKBLAZE_ID + ":" + PRIVATE_BACKBLAZE_KEY).toString("base64")
        }
    });

    if (!res.ok) {
        console.log(await res.text())

    }
    else {
        const result = await res.json();

        console.log(result);

        return json(result);
    }
}