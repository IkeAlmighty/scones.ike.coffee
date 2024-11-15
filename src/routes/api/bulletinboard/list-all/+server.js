import { auth_b2_json } from '$lib/server/utils';
import { PRIVATE_BACKBLAZE_BUCKET_ID } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET = async ({ request }) => {
    try {
        const { authorizationToken, apiInfo: { storageApi: { apiUrl, downloadUrl } } } = await auth_b2_json();

        const listFilesResponse = await fetch(`${apiUrl}/b2api/v3/b2_list_file_names`, {
            method: 'POST',
            headers: {
                Authorization: authorizationToken
            },
            body: JSON.stringify({
                bucketId: PRIVATE_BACKBLAZE_BUCKET_ID,
                maxFileCount: 100
            })
        });

        if (!listFilesResponse.ok) {
            return json({ error: 'Failed to list files in bucket' }, { status: listFilesResponse.status })
        }

        const data = await listFilesResponse.json();


        return json({ files: data.files, downloadUrl });

    } catch (err) {
        console.error(err);
        return json({ error: err })
    }
}