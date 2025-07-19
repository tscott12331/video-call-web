'use server';

import fs from 'fs/promises';
import { createDirIfNotExist } from './file-system';
import { db } from '../db/db';
import { ImageTable } from '../db/schemas/image';
import { authenticateUser } from './auth';
import { UserProfileTable } from '../db/schemas/user';
import { eq } from 'drizzle-orm';

const imageDirPath = './images'
const allowedExtensions = ['png', 'jpg', 'jpeg'];
const allowedTypes = ['image/png', 'image/jpeg'];

export async function saveImage(image: File) {

    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const fileName = crypto.randomUUID();
        const fileType = image.type;
        if(!allowedTypes.includes(fileType)) return {
            error: "Invalid file type",
            success: false,
        };

        const fileExt = image.name.split('.').at(-1);
        if(!fileExt || 
            !allowedExtensions.includes(fileExt)
          ) return {
            error: "Invalid file extension",
            success: false,
        };

        await createDirIfNotExist(imageDirPath);

        const path = `${imageDirPath}/${fileName}.${fileExt}`;

        const buf = new Uint8Array(await image.arrayBuffer());
        await fs.appendFile(path, buf);

        const insertArr = await db.insert(ImageTable).values({
            ImagePath: path,
            ImageType: fileType,
        }).returning({ id: ImageTable.ImageId });

        return {
            success: true,
            imageId: insertArr[0].id
        };
    } catch(err) {
        console.error(err);
        return {
            success: false,
            error: "Server error",
        };
    }

}

export async function setPfp(image: File) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        const res = await saveImage(image);
        if(!res.success || res.error || !res.imageId) {
            const error = res.error ?? "Server error";
            return {
                success: false,
                error
            }
        }

        await db.update(UserProfileTable).set({
            UserPfp: res.imageId,
        }).where(
            eq(UserProfileTable.Username, username),
        );

        return {
            success: true,
        }
    } catch(err) {
        console.error(err);
        return {
            success: false,
            error: "Server error",
        }
    }
}

export async function getPfp() {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        const imgObjs = (await db.select({ 
                                path: ImageTable.ImagePath,
                                type: ImageTable.ImageType,
                            })
                            .from(UserProfileTable)
                            .innerJoin(ImageTable,
                                eq(UserProfileTable.UserPfp, ImageTable.ImageId)
                            )
                            .where(
                                eq(UserProfileTable.Username, username)
                            ));

        if(imgObjs.length === 0) {
            return {
                success: false,
                error: "No profile picture saved",
            }
        }

        const imgObj = imgObjs[0];

        const arrBuff = await fs.readFile(imgObj.path);

        const blob = new Blob([arrBuff])
        const fileName = imgObj.path.split('/').at(-1);
        if(!fileName) return {
            success: false,
            error: "Server error",
        }
        console.log(fileName);

        const file = new File([blob], fileName, { type: imgObj.type });

        return {
            success: true,
            file
        }
    } catch(err) {
        console.error(err);
        return {
            success: false,
            error: "Server error",
        }
    }
}
