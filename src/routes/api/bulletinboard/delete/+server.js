import { auth_b2_json } from '$lib/server/utils';
import { PRIVATE_BACKBLAZE_BUCKET_ID } from '$env/static/private';
import { json } from '@sveltejs/kit'

export const DELETE = async ({ url }) => {
    try {
        const { authorizationToken, apiInfo: { storageApi: { apiUrl, downloadUrl } } } = await auth_b2_json();

        const fileName = url.searchParams.get('fileName');
        const fileId = url.searchParams.get('fileId')

        const deleteFileResponse = await fetch(`${apiUrl}/b2api/v3/b2_delete_file_version?fileId=${fileId}&fileName=${fileName}`, {
            method: 'GET',
            headers: {
                Authorization: authorizationToken,
                "Content-Type": "application/json"
            }
        })

        if (!deleteFileResponse.status.ok) {
            console.log(deleteFileResponse.statusText)
        }


        return json(await deleteFileResponse.json())
    } catch (err) {
        console.log(err);
        return json({ error: 'server error' }, { status: 500 })
    }
}