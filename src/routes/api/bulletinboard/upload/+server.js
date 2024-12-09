import { PRIVATE_BACKBLAZE_BUCKET_ID } from '$env/static/private';
import { auth_b2_json, generateSHA1Hash } from '$lib/server/utils';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    // parse file from request body
    const formData = await request.formData();

    const file = formData.get('file');

    // if (file.size > 150000) {
    //     console.error(`file size size of ${file.size} is too large. Please use a file less than 150kb`)
    //     return json({ error: `file size size of ${file.size} is too large. Please use a file less than 150kb` }, { status: 400 })
    // }

    // get authorization token
    const { authorizationToken, apiInfo: { storageApi: { apiUrl, downloadUrl } } } = await auth_b2_json();

    // get upload url
    const getUploadUrlResponse = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url?bucketId=${PRIVATE_BACKBLAZE_BUCKET_ID}`, {
        method: 'GET',
        headers: {
            Authorization: authorizationToken
        }
    });

    if (!getUploadUrlResponse.ok) {
        return json({ error: 'Failed to retrieve upload urls' }, { status: getUploadUrlResponse.status })
    }

    // upload to url 
    const uploadUrlResponseJSON = await getUploadUrlResponse.json();

    const uploadAuthToken = uploadUrlResponseJSON.authorizationToken;
    const uploadUrl = uploadUrlResponseJSON.uploadUrl;

    const collisionFreeFileName = `${Date.now()}.${file.name.split('.')[1]}`

    const uploadFileResponse = await fetch(uploadUrl, {
        method: 'POST', headers: {
            Authorization: uploadAuthToken,
            'Content-Length': file.size,
            'X-Bz-File-Name': decodeURIComponent(collisionFreeFileName),
            'X-Bz-Content-Sha1': "do_not_verify",
            'Content-Type': file.type
        },
        body: file
    })

    if (!uploadFileResponse.ok) {
        console.error('upload File Response not ok: ', await uploadFileResponse.text());
        return json({ error: 'Failed to upload file to image bucket' }, uploadFileResponse.status)
    }

    // console.log(uploadFileResponse);

    return json({}, { status: uploadFileResponse.status });
}