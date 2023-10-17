import { Client } from "minio";

import {
    MINIO_ACCESS_KEY,
    MINIO_ENDPOINT,
    MINIO_PORT,
    MINIO_SECRET_KEY,
    MINIO_SSL
} from "$env/static/private";

const minio = new Client({
    endPoint: MINIO_ENDPOINT,
    port: parseInt(MINIO_PORT),
    useSSL: MINIO_SSL === "true",
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY
});

export default minio;
