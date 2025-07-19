'use server';

import { PathLike } from "fs";
import fs from 'fs/promises';

export async function createDirIfNotExist(path: PathLike) {
    try {
        await fs.stat(path);
    } catch(err: any) {
        if(err?.code && err.code === 'ENOENT') {
            await createDir(path)
        }
    }
}

async function createDir(path: PathLike) {
    try {
        await fs.mkdir(path)
    } catch(err) {
        console.error(err);
    }
}
