import minio from "$lib/server/db/minio";
import { MINIO_ENDPOINT, MINIO_SSL } from "$env/static/private";
import { createHash } from "crypto";
import type { BucketItem } from "minio";

function generateBucketName(groupCode: string) {
    return `vladik-group-${groupCode}`;
}

export async function createBucket(groupCode: string) {
    const name = generateBucketName(groupCode);

    const policy = JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": ["s3:GetObject"],
                "Effect": "Allow",
                "Principal": {
                    "AWS": ["*"]
                },
                "Resource": [`arn:aws:s3:::${name}/*`],
                "Sid": ""
            }
        ]
    });

    if (await minio.bucketExists(name)) {
        await minio.setBucketPolicy(name, policy);
        return;
    }

    await minio.makeBucket(name);
    await minio.setBucketPolicy(name, policy);
}

export async function deleteBucket(groupCode: string) {
    const name = generateBucketName(groupCode);

    if (await minio.bucketExists(name)) {
        const readObjects = () =>
            new Promise<BucketItem[]>((resolve, error) => {
                const bucketItems: BucketItem[] = [];

                const stream = minio.listObjects(name);

                stream.on("data", item => bucketItems.push(item));
                stream.on("end", () => resolve(bucketItems));
                stream.on("error", error);
            });

        const objects = await readObjects();

        await minio.removeObjects(
            name,
            objects.map(object => object.name!)
        );
        await minio.removeBucket(name);
    }
}

export async function uploadFile(groupCode: string, file: File) {
    const bucket = generateBucketName(groupCode);

    const hashedFileName = createHash("md5")
        .update(Date.now().toString())
        .digest("hex");
    const extension = file.name.substring(
        file.name.lastIndexOf("."),
        file.name.length
    );

    const fullName = hashedFileName + extension;

    const arrayBuffer = await file.arrayBuffer();

    await minio.putObject(bucket, fullName, Buffer.from(arrayBuffer), {
        "Content-Type": file.type
    });

    return `${
        MINIO_SSL === "true" ? "https://" : "http://"
    }${MINIO_ENDPOINT}/${bucket}/${fullName}`;
}
